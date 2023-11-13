import {
  YStack,
  H3,
  XStack,
  Card,
  Label,
  Select,
  Adapt,
  Sheet,
  Button,
  RadioGroup,
} from "tamagui";
import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { LinearGradient } from "tamagui/linear-gradient";
import { useEffect, useState } from "react";
import useStore from "../model/store";
import RadioGroupButton from "../components/RadioGroupButton";
import { deleteAll } from "../storage/sqlite";
import { router } from "expo-router";
import { saveItem } from "../storage/preferences";

const Settings = () => {
  const { terms, currentTerm, campus, setCurrentTerm } = useStore();
  const [selectedTerm, setSelectedTerm] = useState(0);
  const [selectedCampus, setSelectedCampus] = useState(campus);
  const store = useStore();

  useEffect(() => {
    setSelectedTerm(currentTerm.id);
    setSelectedCampus(campus);
    console.log(selectedTerm);
  }, [terms]);

  const acceptTermChange = (termIdStr: string) => {
    const termId = parseInt(termIdStr);
    const term = terms.find((term) => term.id == termId);
    if (term != currentTerm) {
      setSelectedTerm(termId);
      setCurrentTerm(term!);
      acceptDeleteAll();
    }
  };

  const acceptCampusChange = () => {
    store.setCampus(selectedCampus);
    saveItem("campus", selectedCampus);
    acceptDeleteAll();
  };

  const acceptDeleteAll = () => {
    deleteAll();
    store.setSavedClasses([]);
    router.push("/");
  };

  return (
    <YStack space margin={10}>
      <H3>Settings</H3>
      <Card>
        <Card.Header padded>
          <YStack space>
            <Label>Change Term</Label>
            <Select
              value={selectedTerm.toString()}
              onValueChange={acceptTermChange}
              size="$6"
            >
              <Select.Trigger iconAfter={ChevronDown}>
                <Select.Value placeholder="Change Term" />
              </Select.Trigger>
              <Adapt when="sm" platform="touch">
                <Sheet
                  modal
                  dismissOnSnapToBottom
                  animationConfig={{
                    type: "spring",
                    damping: 20,
                    mass: 1.2,
                    stiffness: 250,
                  }}
                >
                  <Sheet.Frame>
                    <Sheet.ScrollView>
                      <Adapt.Contents />
                    </Sheet.ScrollView>
                  </Sheet.Frame>
                  <Sheet.Overlay
                    animation="lazy"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                  />
                </Sheet>
                <Select.Content zIndex={200000}>
                  <Select.ScrollUpButton
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    width="100%"
                    height="$3"
                  >
                    <YStack zIndex={10}>
                      <ChevronUp size={20} />
                    </YStack>
                    <LinearGradient
                      start={[0, 0]}
                      end={[0, 1]}
                      fullscreen
                      colors={["$background", "transparent"]}
                      borderRadius="$4"
                    />
                  </Select.ScrollUpButton>
                  <Select.Viewport
                    animation="quick"
                    animateOnly={["transform", "opacity"]}
                    enterStyle={{ o: 0, y: -10 }}
                    exitStyle={{ o: 0, y: 10 }}
                    minWidth={200}
                  >
                    <Select.Group>
                      {terms.map(
                        (item: { id: number; label: string }, i: number) => {
                          return (
                            <Select.Item
                              debug="verbose"
                              index={i}
                              key={item.id}
                              value={item.id.toString()}
                            >
                              <Select.ItemText>{item.label}</Select.ItemText>
                              <Select.ItemIndicator marginLeft="auto">
                                <Check size={16} />
                              </Select.ItemIndicator>
                            </Select.Item>
                          );
                        }
                      )}
                    </Select.Group>
                  </Select.Viewport>
                  <Select.ScrollDownButton
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    width="100%"
                    height="$3"
                  >
                    <YStack zIndex={10}>
                      <ChevronDown size={20} />
                    </YStack>
                    <LinearGradient
                      start={[0, 0]}
                      end={[0, 1]}
                      fullscreen
                      colors={["transparent", "$background"]}
                      borderRadius="$4"
                    />
                  </Select.ScrollDownButton>
                </Select.Content>
              </Adapt>
            </Select>
          </YStack>
        </Card.Header>
      </Card>
      <Card>
        <Card.Header>
          <YStack space>
            <Label>Change Campus</Label>
            <RadioGroup
              value={selectedCampus}
              onValueChange={setSelectedCampus}
            >
              <YStack space>
                <RadioGroupButton value="O" label="Oxford" />
                <RadioGroupButton value="H" label="Hamilton" />
                <RadioGroupButton value="M" label="Middletown" />
                <RadioGroupButton value="L" label="Luxembourg" />
              </YStack>
            </RadioGroup>
            <Button theme="active" onPress={acceptCampusChange}>
              Save
            </Button>
          </YStack>
        </Card.Header>
      </Card>
      <Card>
        <Card.Header>
          <YStack space>
            <Label>Delete All Information</Label>
            <Button onPress={acceptDeleteAll}>Delete</Button>
          </YStack>
        </Card.Header>
      </Card>
    </YStack>
  );
};

export default Settings;
