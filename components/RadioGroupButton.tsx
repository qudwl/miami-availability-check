import { Label, RadioGroup, XStack } from "tamagui";

type Props = {
  value: string;
  label: string;
};

const RadioGroupButton = ({ value, label }: Props) => {
  return (
    <XStack space>
      <RadioGroup.Item value={value} id={`campus-${value}`}>
        <RadioGroup.Indicator />
      </RadioGroup.Item>
      <Label htmlFor={`campus-${value}`}>{label}</Label>
    </XStack>
  );
};

export default RadioGroupButton;
