import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import en from "locales/en.json";
import vi from "locales/vi.json";
import { useEffect, useState } from "react";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";

export const supportedLngs = ["en", "vi"];

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

export const changeLanguage = async (lng: string) => {
  AsyncStorage.setItem("language", lng);
  i18n.changeLanguage(lng);
};

export const useLanguageInit = (onError: (error: Error) => void) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    AsyncStorage.getItem("language")
      .then((lng) => {
        i18n.changeLanguage(lng || RNLocalize.getLocales()[0].languageCode);
      })
      .catch(onError)
      .finally(() => setLoading(false));
  }, [onError]);

  return [loading];
};

export default i18n;
