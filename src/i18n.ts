import i18n from "i18next";
import { supportedLngs } from "locales/constants";
import en from "locales/en.json";
import vi from "locales/vi.json";
import { useEffect } from "react";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";
import { SettingsValues } from "utils/settings";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    vi: {
      translation: vi,
    },
  },
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  supportedLngs,
});

export const useLanguageInit = (settingsValue: SettingsValues) => {
  useEffect(() => {
    const language =
      settingsValue.language || RNLocalize.getLocales()[0].languageCode;
    i18n.changeLanguage(language);
  }, [settingsValue]);
};

export default i18n;
