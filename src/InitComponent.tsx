import { LoadingScreen } from "components/Loading";
import { SQLiteContext, useSQLiteInit } from "db/SQLiteProvider";
import { useLanguageInit } from "i18n";
import { FC, useState } from "react";
import { SafeAreaView } from "react-native";
import { Colors } from "react-native-paper";
import {
  ColorSchemeContext,
  useColorSchemaSettingsInit,
} from "styles/colorScheme";
import { styles as screenStyles } from "styles/screens";

export const InitComponent: FC = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);
  const [loadingSqlite, sqlite] = useSQLiteInit(setError);
  const [loadingLanguage] = useLanguageInit(setError);
  const [, colorSchemeValue] = useColorSchemaSettingsInit();
  const loading = loadingSqlite || loadingLanguage;

  if (error) throw error;

  if (loading)
    return (
      <SafeAreaView
        style={[
          screenStyles.root,
          {
            backgroundColor:
              colorSchemeValue.colorScheme === "dark"
                ? Colors.black
                : Colors.white,
          },
        ]}
      >
        <LoadingScreen />
      </SafeAreaView>
    );

  return (
    <ColorSchemeContext.Provider value={colorSchemeValue}>
      <SQLiteContext.Provider value={sqlite!}>
        {children}
      </SQLiteContext.Provider>
    </ColorSchemeContext.Provider>
  );
};
