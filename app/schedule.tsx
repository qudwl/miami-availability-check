import { Card, H3, H5, Paragraph, SizableText, XStack, YStack } from "tamagui";
import { getCRNs } from "../storage/sqlite";
import { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";

const Schedule = () => {
  const [crns, setCRNs] = useState<
    {
      crn: number;
      subject: string;
      cid: number;
      section: string;
      title: string;
    }[]
  >([]);

  useEffect(() => {
    getCRNs().then((res) => {
      setCRNs(res);
    });
  }, []);
  return (
    <YStack space margin={10}>
      <H3>CRNs</H3>
      <FlatList
        data={crns}
        renderItem={({ item, index }) => (
          <Card marginBottom={10} key={index}>
            <Card.Header>
              <YStack>
                <H5>{item.crn}</H5>
                <Paragraph theme="alt1">{`${item.subject} ${item.cid} ${item.section}`}</Paragraph>
                <Paragraph theme="alt2">{item.title}</Paragraph>
              </YStack>
            </Card.Header>
          </Card>
        )}
      />
    </YStack>
  );
};

export default Schedule;
