import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import * as RNLocalize from "react-native-localize";
import { useSettings } from "./settings";

export const supportedCurrencies = ["USD", "VND"] as const; // ISO 4217

export const useCurrentCurrency = () => {
  const { value } = useSettings();
  const machineCurrencies = useMemo(() => RNLocalize.getCurrencies(), []);
  return value.currency || machineCurrencies[0];
};

export const useNumberFormatCurrency = (options?: Intl.NumberFormatOptions) => {
  const { i18n } = useTranslation();
  const currency = useCurrentCurrency();
  return useMemo(
    () =>
      new Intl.NumberFormat(i18n.language, {
        currency,
        style: "currency",
        ...options,
      }),
    [i18n.language, currency, options]
  );
};
