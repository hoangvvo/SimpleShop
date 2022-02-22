import AsyncStorage from "@react-native-async-storage/async-storage";
import type { supportedLngs } from "locales/constants";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ColorSchemeName } from "react-native";
import type { supportedCurrencies } from "utils/currency";

export interface SettingsValues {
  colorScheme: ColorSchemeName;
  language: typeof supportedLngs[number] | undefined | null;
  currency: typeof supportedCurrencies[number] | undefined | null;
}

type ChangeSetting = <T extends keyof SettingsValues>(
  key: T,
  newValue: SettingsValues[T]
) => void;

const defaultValues: SettingsValues = {
  colorScheme: undefined,
  language: undefined,
  currency: undefined,
};

export const SettingsContext = createContext({ value: defaultValues } as {
  value: SettingsValues;
  changeSetting: ChangeSetting;
});

export const useSettingsProvider = () => {
  const [value, setValue] = useState(defaultValues);

  // restore settings
  useEffect(() => {
    (async () => {
      const values = (await AsyncStorage.multiGet([
        "colorScheme",
        "language",
        "currency",
      ])) as [
        [string, SettingsValues["colorScheme"]],
        [string, SettingsValues["language"]],
        [string, SettingsValues["currency"]]
      ];
      setValue({
        colorScheme: values[0][1],
        language: values[1][1],
        currency: values[2][1],
      });
    })();
  }, []);

  const changeSetting = useCallback<ChangeSetting>((key, newValue) => {
    if (newValue === undefined || newValue === null) {
      AsyncStorage.removeItem(key);
    } else {
      AsyncStorage.setItem(key, newValue);
    }
    setValue((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  }, []);

  return useMemo(
    () => ({
      value,
      changeSetting,
    }),
    [value, changeSetting]
  );
};

export const useSettings = () => useContext(SettingsContext);
