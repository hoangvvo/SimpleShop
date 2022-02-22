import { LoadingScreen } from "components/Loading";
import { SQLiteContext, useSQLiteInit } from "db/SQLiteProvider";
import { useLanguageInit } from "i18n";
import type { FC } from "react";
import { useState } from "react";
import { SafeAreaView } from "react-native";
import { Colors } from "react-native-paper";
import { useCurrentColorScheme } from "styles/colorScheme";
import { styles as screenStyles } from "styles/screens";
import { SettingsContext, useSettingsProvider } from "./utils/settings";

export const InitComponent: FC = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);
  const [loadingSqlite, sqlite] = useSQLiteInit(setError);
  const loading = loadingSqlite;

  const settingsProvided = useSettingsProvider();

  useLanguageInit(settingsProvided.value);

  const colorScheme = useCurrentColorScheme();

  if (error) throw error;

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
      </SQLiteContext.Provider>
    </SettingsContext.Provider>
  );
};
