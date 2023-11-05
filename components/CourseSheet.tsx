import {
  Button,
  Card,
  H2,
  H4,
  Paragraph,
  Separator,
  Sheet,
  SizableText,
  Square,
  Tabs,
  XStack,
  YStack,
} from "tamagui";
import Course from "../model/Course";
import { Accordion } from "tamagui";
import { ChevronDown } from "@tamagui/lucide-icons";
import { insertCourse } from "../storage/sqlite";

const days: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

type Props = {
  course: Course | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};
const CourseSheet = ({ course, open, setOpen }: Props) => {
  const addCourseToDatabase = () => {
    try {
      insertCourse(course);
      console.log("Course added to database.");
      setTimeout(() => {
        setOpen(false);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen} modal dismissOnSnapToBottom>
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame>
        <Sheet.ScrollView>
          <YStack alignItems="center" space margin={10}>
            <YStack alignItems="center">
              <H4
                textAlign="center"
                theme="alt1"
              >{`${course?.subject} ${course?.cid} ${course?.section}`}</H4>
              <H2 textAlign="center">{course?.title}</H2>
              <Paragraph textAlign="center" theme="alt2">
                {course?.credits} Hours | {course?.instructors}
              </Paragraph>
            </YStack>
            <XStack space>
              <Button theme="active" onPress={addCourseToDatabase}>
                Add Course
              </Button>
              <Button>See other sections</Button>
            </XStack>
          </YStack>
          <Accordion
            defaultValue={["description"]}
            overflow="hidden"
            width="100%"
            collapsible
          >
            <Accordion.Item value="description">
              <Accordion.Trigger
                flexDirection="row"
                justifyContent="space-between"
              >
                {({ open }: { open: boolean }) => (
                  <>
                    <Paragraph>Description</Paragraph>
                    <Square animation="quick" rotate={open ? "180deg" : "0deg"}>
                      <ChevronDown size="$1" />
                    </Square>
                  </>
                )}
              </Accordion.Trigger>
              <Accordion.Content>
                <Paragraph>{course?.description}</Paragraph>
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item value="schedule">
              <Accordion.Trigger
                flexDirection="row"
                justifyContent="space-between"
              >
                {({ open }: { open: boolean }) => (
                  <>
                    <Paragraph>Schedule</Paragraph>
                    <Square animation="quick" rotate={open ? "180deg" : "0deg"}>
                      <ChevronDown size="$1" />
                    </Square>
                  </>
                )}
              </Accordion.Trigger>
              <Accordion.Content>
                {course?.times.map((time, index) => {
                  return (
                    <XStack justifyContent="space-between" key={index}>
                      <Paragraph>
                        {`${days[time.day]} ${time.start.time}-${
                          time.end.time
                        }`}
                      </Paragraph>
                      <Paragraph>{time.buildingName}</Paragraph>
                    </XStack>
                  );
                })}
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
};

export default CourseSheet;
