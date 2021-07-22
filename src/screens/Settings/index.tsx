import { Picker } from "@react-native-picker/picker";
import { StackScreenProps } from "@react-navigation/stack";
import { dbName, dbPath, deleteDb } from "db/sqlite";
import { changeLanguage, supportedLngs } from "i18n";
import { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Platform, StyleSheet, View } from "react-native";
import DocumentPicker from "react-native-document-picker";
import RNFS from "react-native-fs";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Colors } from "react-native-paper";
// @ts-ignore
import RNRestart from "react-native-restart";
import { SafeAreaView } from "react-native-safe-area-context";
import { ParamList, RouteName } from "screens/types";
import { styles as screenStyles } from "styles/screens";
import { toast } from "utils/toasts";

const styles = StyleSheet.create({
  button: {
    marginBottom: 12,
  },
  picker: {
    marginBottom: 12,
    backgroundColor: Colors.grey200,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey500,
    borderRadius: 4,
  },
  pickerItem: {
    color: Colors.grey900,
  },
});

export const SettingsScreen: FC<
  StackScreenProps<ParamList, RouteName.Settings>
> = () => {
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const onDelete = useCallback(() => {
    Alert.alert(
      "Reset all data?",
      t("action.not_undoable"),
      [
        {
          text: t("action.cancel"),
          style: "cancel",
        },
        {
          text: t("action.yes"),
          onPress: async () => {
            setLoading(true);
            await deleteDb();
            RNRestart.Restart();
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  }, [t]);
  const onExport = useCallback(async () => {
    try {
      setLoading(true);
      if (Platform.OS === "ios") throw new Error("Not implemented");
      const copyToPath = `${
        RNFS.DownloadDirectoryPath
      }/${Date.now()}_${dbName}`;
      await RNFS.copyFile(dbPath, copyToPath);
      setLoading(false);
      toast(t("settings.export.ok_message", { path: copyToPath }));
    } catch (e) {
      /* noop */
    }
  }, [t]);
  const onImport = useCallback(async () => {
    try {
      const { fileCopyUri } = await DocumentPicker.pick({
        // @ts-ignore
        type: DocumentPicker.types.allFiles,
        copyTo: "cachesDirectory",
      });
      Alert.alert(
        t("settings.import.title"),
        t("settings.import.prompt"),
        [
          {
            text: t("action.cancel"),
            style: "cancel",
          },
          {
            text: t("action.yes"),
            onPress: async () => {
              setLoading(true);
              await deleteDb();
              await RNFS.copyFile(fileCopyUri, dbPath);
              RNRestart.Restart();
            },
          },
        ],
        { cancelable: true }
      );
    } catch (e) {
      /* noop */
    }
  }, [t]);
  return (
    <SafeAreaView style={screenStyles.root}>
      <ScrollView style={screenStyles.content}>
        <View style={styles.picker}>
          <Picker
            selectedValue={i18n.language}
            onValueChange={(itemValue) => changeLanguage(itemValue)}
            itemStyle={styles.pickerItem}
          >
            {supportedLngs.map((lng) => (
              <Picker.Item key={lng} label={t(`language.${lng}`)} value={lng} />
            ))}
          </Picker>
        </View>
        <Button
          disabled={loading}
          style={styles.button}
          mode="contained"
          onPress={onExport}
        >
          {t("settings.export.title")}
        </Button>
        <Button
          disabled={loading}
          style={styles.button}
          mode="outlined"
          onPress={onImport}
        >
          {t("settings.import.title")}
        </Button>
        <Button
          disabled={loading}
          style={styles.button}
          mode="outlined"
          color={Colors.red400}
          onPress={onDelete}
        >
          Reset
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};
