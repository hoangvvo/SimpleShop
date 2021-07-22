import { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import { FC } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

export const CustomBackgroundComponent: FC<BottomSheetBackgroundProps> = ({
  style,
  pointerEvents,
}) => {
  const theme = useTheme();
  return (
    <View
      pointerEvents={pointerEvents}
      style={[style, { backgroundColor: theme.colors.background }]}
    />
  );
};
