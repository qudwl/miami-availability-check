import {
  YStack,
  H3,
  XStack,
  Card,
  Label,
  Select,
  Adapt,
  Sheet,
  AlertDialog,
  Button,
  RadioGroup,
} from "tamagui";
import { Check, ChevronDown, ChevronUp, Radio } from "@tamagui/lucide-icons";
import { LinearGradient } from "tamagui/linear-gradient";
import { useEffect, useState } from "react";
import useStore from "../model/store";
import TermInfo from "../model/TermInfo";
import { router } from "expo-router";
import RadioGroupButton from "../components/RadioGroupButton";

const Settings = () => {
  const { terms, currentTerm, campus, setCurrentTerm } = useStore();
  const [selectedTerm, setSelectedTerm] = useState(0);
  const [selectedCampus, setSelectedCampus] = useState(campus);
  const [changeTermAlert, setChangeTermAlert] = useState(false);

  useEffect(() => {
    setSelectedTerm(currentTerm.id);
    console.log(selectedTerm);
  }, [terms]);

  const openAlert = (termId: number) => {
    const term = terms.find((term) => term.id == termId);
    if (term != currentTerm) {
      setSelectedTerm(termId);
      setChangeTermAlert(true);
    }
  };

  const acceptTermChange = () => {
    const term = terms.find((term) => term.id == selectedTerm);
    if (term != null) {
      setCurrentTerm(term);
      setChangeTermAlert(false);
      router.push("/");
    }
  };

  return (
    <YStack space margin={10}>
      <H3>Settings</H3>
      <Card>
        <Card.Header padded>
          <YStack space>
            <Label>Change Term</Label>
            <Select value={selectedTerm} onValueChange={openAlert} size="$6">
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
                              value={item.id}
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
              defaultValue="o"
            >
              <YStack space>
                <RadioGroupButton value="o" label="Oxford" />
                <RadioGroupButton value="h" label="Hamilton" />
              </YStack>
            </RadioGroup>
            <Button theme="active">Save</Button>
          </YStack>
        </Card.Header>
      </Card>
      <AlertDialog open={changeTermAlert} onOpenChange={setChangeTermAlert}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <AlertDialog.Content
            bordered
            elevate
            key="content"
            animation={[
              "quick",
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            x={0}
            scale={1}
            opacity={1}
            y={0}
          >
            <YStack space>
              <AlertDialog.Title>Change Term</AlertDialog.Title>
              <AlertDialog.Description>
                Would you like to change the term to{" "}
                {terms.find((term) => term.id == selectedTerm)?.label}?
              </AlertDialog.Description>
              <XStack space>
                <AlertDialog.Cancel asChild>
                  <Button>Cancel</Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button theme="active" onPress={acceptTermChange}>
                    Change
                  </Button>
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </YStack>
  );
};

export default Settings;
