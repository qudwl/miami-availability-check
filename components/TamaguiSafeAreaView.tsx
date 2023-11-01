import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "tamagui";

export const TamaguiSafeAreaView = styled(SafeAreaView, {
  name: "TamaguiSafeAreaView",
  flex: 1,
  backgroundColor: "$backgroundStrong",
});
