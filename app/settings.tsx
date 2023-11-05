import { Stack } from "expo-router";
import { YStack, H3, XStack, Card, Label, Select, Adapt } from "tamagui";

const Settings = () => {
  return (
    <YStack space margin={10}>
      <Stack.Screen options={{ title: "Settings" }} />
      <H3>Settings</H3>
      <Card>
        <Card.Header padded>
          <YStack space>
            <Label>Term</Label>
            <Select>
              <Select.Trigger>
                <Select.Value placeholder="Term" />
              </Select.Trigger>
              <Adapt when="sm" platform="touch">
                <Select.Sheet>
                  <Select.Sheet.Frame></Select.Sheet.Frame>
                  <Select.Sheet.Overlay />
                </Select.Sheet>
              </Adapt>
              <Select.Content>
                <Select.ScrollUpButton />
                <Select.ScrollDownButton />
              </Select.Content>
            </Select>
          </YStack>
        </Card.Header>
      </Card>
    </YStack>
  );
};

export default Settings;
