import Clipboard from "@react-native-clipboard/clipboard";
import { LoadingScreen } from "components/Loading";
import { toast } from "components/Toast";
import { SQLiteContext, useSQLiteInit } from "db/SQLiteProvider";
import { useLanguageInit } from "i18n";
import type { FC } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, SafeAreaView } from "react-native";
import { Colors, Paragraph, Title } from "react-native-paper";
import { useCurrentColorScheme } from "styles/colorScheme";
import { styles as screenStyles } from "styles/screens";
import { SettingsContext, useSettingsProvider } from "./utils/settings";

const ErrorBar: FC<{ error: Error }> = ({ error }) => {
  const { t } = useTranslation();
  return (
    <Pressable
      style={{ backgroundColor: Colors.red400 }}
      onLongPress={() => {
        toast("Copied to classboard");
        Clipboard.setString(error.stack || error.message);
      }}
    >
      <Title>{t("error.something_went_wrong")}</Title>
      <Paragraph>{t("error.general_description")}</Paragraph>
    </Pressable>
  );
};

export const InitComponent: FC = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);
  const [loadingSqlite, sqlite] = useSQLiteInit(setError);
  const loading = loadingSqlite;

  const settingsProvided = useSettingsProvider();

  useLanguageInit(settingsProvided.value);

  const colorScheme = useCurrentColorScheme();

  if (loading)
    return (
      <SafeAreaView
        style={[
          screenStyles.root,
          {
            backgroundColor:
              (settingsProvided.value.colorScheme || colorScheme) === "dark"
                ? Colors.black
                : Colors.white,
          },
        ]}
      >
        <LoadingScreen />
      </SafeAreaView>
    );

  return (
    <SettingsContext.Provider value={settingsProvided}>
      <SQLiteContext.Provider value={sqlite!}>
        {children}
        {error && <ErrorBar error={error} />}
      </SQLiteContext.Provider>
    </SettingsContext.Provider>
  );
};
