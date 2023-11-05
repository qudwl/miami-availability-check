import { H4, YStack, Spinner } from "tamagui";
import React, { useState, useEffect } from "react";
import { getDeptData, getTerm } from "../scripts/api";
import { FlatList } from "react-native-gesture-handler";
import Course from "../model/Course";
import DepartmentSelect from "../components/DepartmentSelect";
import TermInfo from "../model/TermInfo";
import ListCardItem from "../components/ListCardItem";
import {
  checkIfSupportsSecureStore,
  getItem,
  saveItem,
} from "../storage/preferences";
import CourseSheet from "../components/CourseSheet";
import { init } from "../storage/sqlite";
import ToastComponent from "../components/ToastComponent";

const findCurrentTerm = (terms: TermInfo[]): TermInfo => {
  let curDate = new Date();
  let curTerm = terms[0];
  for (let term of terms) {
    if (curDate >= term.startDate && curDate <= term.endDate) {
      curTerm = term;
      break;
    }
  }

  return curTerm;
};

const Home = () => {
  const [searchValue, setSearchValue] = useState("");
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [curTerm, setCurTerm] = useState<TermInfo>();
  const [data, setData] = useState<Course[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [firstPageReceived, setFirstPageReceived] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [openSheet, setOpenSheet] = useState(false);
  const onChangeSearch = (query: string) => setSearchValue(query);

  // Fetch more data when user scrolls to the bottom of the list.
  const fetchNextPage = () => {
    if (firstPageReceived && canLoadMore && curTerm != undefined) {
      setIsLoading(true);
      getDeptData(curTerm.id, searchValue, offset).then((res) => {
        if (data == undefined) setData(res[1]);
        else setData([...data, ...res[1]]);
        if (res[0]) {
          setCanLoadMore(true);
          setOffset(offset + 1);
        } else {
          setOffset(0);
          setCanLoadMore(false);
        }
        setIsLoading(false);
      });
    }
  };

  // Find current term.
  useEffect(() => {
    init();
    checkIfSupportsSecureStore().then((check) => {
      if (check) {
        getItem("curTerm").then((term) => {
          if (term == null) {
            getTerm().then((data) => {
              const tmp = findCurrentTerm(data);
              setCurTerm(tmp);
              saveItem("curTerm", JSON.stringify(tmp));
            });
          } else {
            const parsed = JSON.parse(term);
            setCurTerm(parsed);
          }
        });
      }
    });
  }, []);

  // Fetch data when search value changes.
  useEffect(() => {
    if (searchValue != "" && curTerm != undefined) {
      setFirstPageReceived(false);
      setData([]);
      setIsLoading(true);
      getDeptData(curTerm.id, searchValue).then((res) => {
        setData(res[1]);
        if (res[0]) {
          setCanLoadMore(true);
          setOffset(offset + 1);
          setFirstPageReceived(true);
        } else {
          setOffset(0);
          setCanLoadMore(false);
          setFirstPageReceived(false);
        }
        setIsLoading(false);
      });
    }
  }, [searchValue, curTerm]);

  return (
    <YStack margin={10} space>
      <H4 textAlign="center">{curTerm != undefined ? curTerm.label : ""}</H4>
      <DepartmentSelect
        searchTerm={searchValue}
        setSearchTerm={setSearchValue}
      />
      <FlatList
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.8}
        style={{ height: "80%" }}
        data={data}
        renderItem={({ item }) => (
          <ListCardItem
            item={item}
            setOpen={setOpenSheet}
            setCourse={setSelectedCourse}
          />
        )}
        ListFooterComponent={isLoading ? <Spinner size="large" /> : <></>}
      />
      <CourseSheet
        course={selectedCourse}
        open={openSheet}
        setOpen={setOpenSheet}
      />
    </YStack>
  );
};
export default Home;
