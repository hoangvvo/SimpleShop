import { useColorScheme } from "react-native";
import { useSettings } from "utils/settings";

export const useCurrentColorScheme = () => {
  const { value } = useSettings();
  const deviceScheme = useColorScheme();
  return value.colorScheme || deviceScheme || "light";
};
