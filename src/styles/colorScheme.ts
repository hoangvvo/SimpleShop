import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ColorSchemeName, useColorScheme } from "react-native";

export const ColorSchemeContext = createContext(
  {} as {
    setColorScheme(colorSchema: ColorSchemeName): void;
    colorScheme: NonNullable<ColorSchemeName>;
    preferredColorScheme: ColorSchemeName;
  }
);

const STORAGE_KEY = "color-scheme";

const getInitialColorScheme = async () => {
  const preferredColorScheme = (await AsyncStorage.getItem(STORAGE_KEY)) as
    | NonNullable<ColorSchemeName>
    | undefined;

  return preferredColorScheme;
};

export const useColorSchemaSettingsInit = () => {
  const systemColorScheme = useColorScheme();
  const [preferredColorScheme, setPreferredColorScheme] =
    useState<ColorSchemeName>();

  useEffect(() => {
    getInitialColorScheme().then(setPreferredColorScheme);
  }, []);

  const setColorScheme = useCallback((colorScheme: ColorSchemeName) => {
    if (!colorScheme) {
      AsyncStorage.removeItem(STORAGE_KEY);
    } else {
      AsyncStorage.setItem(STORAGE_KEY, colorScheme);
    }
    setPreferredColorScheme(colorScheme);
  }, []);

  return [
    false,
    {
      setColorScheme,
      colorScheme: preferredColorScheme || systemColorScheme || "light",
      preferredColorScheme,
    },
  ] as const;
};

export const useColorSchemeSettings = () => useContext(ColorSchemeContext);
