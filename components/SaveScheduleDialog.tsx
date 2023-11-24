import React, { useState } from "react";
import {
  Adapt,
  Button,
  Dialog,
  Fieldset,
  Input,
  Label,
  Sheet,
  Unspaced,
  XStack,
} from "tamagui";
import { X } from "@tamagui/lucide-icons";
import useStore from "../model/store";
import { saveScheduleToWeb } from "../scripts/api";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SaveScheduleDialog = ({ open, setOpen }: Props) => {
  const { savedClasses } = useStore();
  const [name, setName] = useState("");

  const saveBtn = () => {
    console.log("save");
    saveScheduleToWeb(savedClasses, name).then((_) => {
      setName("");
      setOpen(false);
    });
  };
  return (
    <Dialog
      modal
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <Adapt when="sm" platform="touch">
        <Sheet animation="medium" zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding="$4" gap="$4">
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={["transform", "opacity"]}
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
          gap="$4"
        >
          <Dialog.Title>Save Schedules</Dialog.Title>
          <Dialog.Description>
            Save it to the web for backup and retrieval.
          </Dialog.Description>
          <Fieldset gap="$4" horizontal>
            <Label width={160} justifyContent="flex-end" htmlFor="name">
              Name
            </Label>
            <Input
              value={name}
              onChangeText={(text) => setName(text)}
              flex={1}
              id="name"
              placeholder="Your Name"
            />
          </Fieldset>
          <XStack alignSelf="flex-end" gap="$4">
            <Button onPress={() => setOpen(false)}>Cancel</Button>
            <Button onPress={saveBtn}>Save</Button>
          </XStack>

          <Unspaced>
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$3"
                right="$3"
                size="$2"
                circular
                icon={X}
              />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default SaveScheduleDialog;
