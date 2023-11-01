import { Select, Adapt, Sheet, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import React, { useMemo } from "react";
import departments from "../constants/departments.json";

type Props = {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
};

const DepartmentSelect = ({ searchTerm, setSearchTerm }: Props) => {
  return (
    <Select size="$6" value={searchTerm} onValueChange={setSearchTerm}>
      <Select.Trigger iconAfter={ChevronDown}>
        <Select.Value placeholder="Subject" />
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
            // to do animations:
            // animation="quick"
            // animateOnly={['transform', 'opacity']}
            // enterStyle={{ o: 0, y: -10 }}
            // exitStyle={{ o: 0, y: 10 }}
            minWidth={200}
          >
            <Select.Group>
              {/* for longer lists memoizing these is useful */}
              {useMemo(
                () =>
                  departments.map((item, i) => {
                    return (
                      <Select.Item
                        debug="verbose"
                        index={i}
                        key={item.value}
                        value={item.value}
                      >
                        <Select.ItemText>{item.label}</Select.ItemText>
                        <Select.ItemIndicator marginLeft="auto">
                          <Check size={16} />
                        </Select.ItemIndicator>
                      </Select.Item>
                    );
                  }),
                [departments]
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
  );
};

export default DepartmentSelect;
