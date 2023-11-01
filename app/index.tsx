import { View, Text, StyleProp } from "react-native";
import { ActivityIndicator, Appbar, Card, Searchbar } from "react-native-paper";
import React, { useState, useEffect } from "react";
import Departments from "../constants/departments.json";
import getDeptData from "./api";
import { FlatList } from "react-native-gesture-handler";
import Course from "../model/Course";
import { StatusBar } from "expo-status-bar";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<Course[]>();
  const [isLoading, setIsLoading] = useState(false);
  const onChangeSearch = (query: string) => setSearchTerm(query);

  useEffect(() => {
    if (Departments.indexOf(searchTerm.substring(0, 3).toUpperCase()) > -1) {
      setIsLoading(true);
      getDeptData().then((data) => {
        setData(data[1]);
        setIsLoading(false);
      });
    } else {
    }
  }, [searchTerm]);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Course Search" />
      </Appbar.Header>
      <Searchbar value={searchTerm} onChangeText={onChangeSearch} />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          style={{ height: "80%" }}
          data={data}
          renderItem={({ item }) => {
            return (
              <Card style={{ margin: 10 }}>
                <Card.Title
                  title={`${item.subject} ${item.cid} ${item.section}`}
                  subtitle={item.title}
                />
              </Card>
            );
          }}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
};

const styles = {
  container: {
    margin: 20,
    flex: 1,
    gap: 10,
  },
};
export default Home;
