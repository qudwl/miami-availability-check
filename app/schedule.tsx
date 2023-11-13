import {
  Button,
  Card,
  H3,
  H4,
  Label,
  Paragraph,
  XStack,
  YStack,
} from "tamagui";
import { deleteCourse } from "../storage/sqlite";
import useStore from "../model/store";
import { FlatList } from "react-native-gesture-handler";
import Course from "../model/Course";
import { useEffect, useState } from "react";
import * as Clipboard from "expo-clipboard";
import CourseSheet from "../components/CourseSheet";
import { getCourseFromCRN } from "../scripts/api";

const Schedule = () => {
  const { savedClasses, setSavedClasses, currentTerm } = useStore();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [openSheet, setOpenSheet] = useState(false);

  const sheetAction = {
    label: "Delete Course",
    onPress: () => {
      if (selectedCourse != null) {
        deleteCourse(selectedCourse.crn);
        setSavedClasses(
          savedClasses.filter((course) => course.crn != selectedCourse.crn)
        );
      }
    },
  };

  useEffect(() => {
    const crnsToUpdate: string[] = [];
    savedClasses.forEach((course) => {
      if (course.currentEnrollment == undefined) {
        crnsToUpdate.push(course.crn.toString());
      }
    });

    getCourseFromCRN(currentTerm.id, crnsToUpdate).then((res) => {
      setSavedClasses(
        savedClasses.map((course) => {
          const newCourse = res.find((c) => c.crn == course.crn);
          if (newCourse != undefined) {
            return newCourse;
          } else {
            return course;
          }
        })
      );
    });
  }, []);

  const copyBtn = async (crn: number) => {
    await Clipboard.setStringAsync(crn.toString());
  };

  const refreshBtn = () => {
    const crnsToUpdate: string[] = savedClasses.map((course) =>
      course.crn.toString()
    );

    getCourseFromCRN(currentTerm.id, crnsToUpdate).then((res) => {
      setSavedClasses(
        savedClasses.map((course) => {
          const newCourse = res.find((c) => c.crn == course.crn);
          if (newCourse != undefined) {
            return newCourse;
          } else {
            return course;
          }
        })
      );
    });
  };

  const deleteBtn = (crn: number) => {
    deleteCourse(crn);
    setSavedClasses(savedClasses.filter((course) => course.crn != crn));
  };

  return (
    <YStack space margin={10}>
      <XStack justifyContent="space-between" space>
        <H3>Saved Courses</H3>
        <Button theme="active" onPress={refreshBtn}>
          Refresh
        </Button>
      </XStack>
      <FlatList
        data={savedClasses}
        renderItem={({ item, index }) => (
          <Card
            marginBottom={10}
            key={index}
            onPress={() => {
              setSelectedCourse(item);
              setOpenSheet(true);
            }}
          >
            <Card.Header>
              <XStack justifyContent="space-between">
                <YStack>
                  <H4>{`${item.subject} ${item.cid} ${item.section}`}</H4>
                  <Paragraph theme="alt1">{item.title}</Paragraph>
                  <Paragraph theme="alt2">{item.crn}</Paragraph>
                </YStack>

                <Label
                  color={
                    item.currentEnrollment < item.maxEnrollment
                      ? "green"
                      : "red"
                  }
                >
                  {item.currentEnrollment} / {item.maxEnrollment}
                </Label>
              </XStack>
            </Card.Header>
            <Card.Footer padded>
              <XStack space>
                <Button onPress={() => deleteBtn(item.crn)}>Delete</Button>
                <Button onPress={() => copyBtn(item.crn)}>Copy</Button>
              </XStack>
            </Card.Footer>
          </Card>
        )}
      />
      <CourseSheet
        open={openSheet}
        setOpen={setOpenSheet}
        course={selectedCourse}
        action={sheetAction}
      />
    </YStack>
  );
};

export default Schedule;
