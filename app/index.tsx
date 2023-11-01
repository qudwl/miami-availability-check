import { Card, H4, Paragraph, YStack, Spinner } from "tamagui";
import React, { useState, useEffect } from "react";
import { getDeptData, getTerm } from "../scripts/api";
import { FlatList } from "react-native-gesture-handler";
import Course from "../model/Course";
import DepartmentSelect from "../components/DepartmentSelect";
import TermInfo from "../model/TermInfo";

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
  const onChangeSearch = (query: string) => setSearchValue(query);

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

  useEffect(() => {
    console.log(2);
    getTerm().then((data) => {
      setCurTerm(findCurrentTerm(data));
    });
  }, []);

  useEffect(() => {
    console.log(1);
    if (searchValue != "" && curTerm != undefined) {
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
    <YStack margin={10}>
      <H4>{curTerm != undefined ? curTerm.label : ""}</H4>
      <DepartmentSelect
        searchTerm={searchValue}
        setSearchTerm={setSearchValue}
      />
      <FlatList
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.8}
        style={{ height: "80%" }}
        data={data}
        renderItem={({ item }) => {
          return (
            <Card style={{ marginTop: 10, marginBottom: 10 }}>
              <Card.Header padded>
                <H4>{`${item.subject} ${item.cid} ${item.section}`}</H4>
                <Paragraph theme="alt2">{item.title}</Paragraph>
              </Card.Header>
            </Card>
          );
        }}
        ListFooterComponent={isLoading ? <Spinner size="large" /> : <></>}
      />
    </YStack>
  );
};
export default Home;
