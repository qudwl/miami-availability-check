import { Card, H4, Paragraph, XStack, YStack } from "tamagui";
import Course from "../model/Course";
import { router } from "expo-router";

type Props = {
  item: Course;
  setOpen: (open: boolean) => void;
  setCourse: (course: Course) => void;
};

const days: string[] = ["M", "T", "W", "R", "F"];

const ListCardItem = ({ item, setOpen, setCourse }: Props) => {
  return (
    <Card
      onPress={() => {
        setCourse(item);
        setOpen(true);
      }}
      marginTop={20}
    >
      <Card.Header padded>
        <XStack flex={1} justifyContent="space-between">
          <YStack flex={1} justifyContent="center">
            <H4>{`${item.subject} ${item.cid} ${item.section}`}</H4>
            <Paragraph theme="alt1">{item.title}</Paragraph>
          </YStack>
          <YStack>
            {item.times.length > 0 ? (
              item.times.map((time, index) => {
                return (
                  <Paragraph key={index} theme="alt2">
                    {`${days[time.day]} ${time.start.time}-${time.end.time}`}
                  </Paragraph>
                );
              })
            ) : (
              <Paragraph theme="alt2">Synchronous</Paragraph>
            )}
          </YStack>
        </XStack>
      </Card.Header>
    </Card>
  );
};

export default ListCardItem;
