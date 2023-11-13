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
import { getDBClasses, init, insertCourse } from "../storage/sqlite";
import ToastComponent from "../components/ToastComponent";
import useStore from "../model/store";

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
  const [data, setData] = useState<Course[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [firstPageReceived, setFirstPageReceived] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [openSheet, setOpenSheet] = useState(false);
  const onChangeSearch = (query: string) => setSearchValue(query);
  const {
    setCurrentTerm,
    setTerms,
    currentTerm,
    campus,
    savedClasses,
    setCampus,
    setSavedClasses,
  } = useStore();

  // Fetch more data when user scrolls to the bottom of the list.
  const fetchNextPage = () => {
    if (firstPageReceived && canLoadMore && currentTerm != undefined) {
      setIsLoading(true);
      getDeptData(currentTerm.id, searchValue, offset).then((res) => {
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

  const sheetAction = {
    label: "Add Course",
    onPress: (course: Course) => {
      insertCourse(course);
      setSavedClasses([...savedClasses, course]);
    },
  };

  // Find current term.
  useEffect(() => {
    init();
    checkIfSupportsSecureStore().then((check) => {
      let haveToReset = true;
      let hasCampus = false;
      if (check) {
        getItem("currentTerm").then((term) => {
          if (term != null) {
            const parsed = JSON.parse(term);
            haveToReset = false;
            setCurrentTerm(parsed);
          }
        });
        getItem("campus").then((campus) => {
          if (campus != null) {
            const parsed = JSON.parse(campus);
            setCampus(parsed);
            hasCampus = true;
          }
        });
      }
      getTerm().then((data) => {
        const tmp = findCurrentTerm(data);
        setTerms(data);

        if (haveToReset) {
          setCurrentTerm(tmp);
          saveItem("currentTerm", JSON.stringify(tmp));
        }
      });
      if (!hasCampus) {
        setCampus("O");
        saveItem("campus", "O");
      }
    });
    getDBClasses().then((res) => {
      setSavedClasses(res);
    });
  }, []);

  // Fetch data when search value changes.
  useEffect(() => {
    if (searchValue != "" && currentTerm != undefined) {
      setFirstPageReceived(false);
      setData([]);
      setIsLoading(true);
      getDeptData(currentTerm.id, searchValue).then((res) => {
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
  }, [searchValue]);

  return (
    <YStack margin={10} space>
      <H4 textAlign="center">
        {currentTerm != undefined ? currentTerm.label : ""}
      </H4>
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
        action={sheetAction}
      />
    </YStack>
  );
};
export default Home;
