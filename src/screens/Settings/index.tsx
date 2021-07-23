import { Picker } from "@react-native-picker/picker";
import { StackScreenProps } from "@react-navigation/stack";
import { dbName, dbPath, deleteDb } from "db/sqlite";
import { changeLanguage, supportedLngs } from "i18n";
import { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  ColorSchemeName,
  Linking,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import DocumentPicker from "react-native-document-picker";
import RNFS from "react-native-fs";
import { ScrollView } from "react-native-gesture-handler";
import { Caption, Colors, List, Text, useTheme } from "react-native-paper";
// @ts-ignore
import RNRestart from "react-native-restart";
import { ParamList, RouteName } from "screens/types";
import { useColorSchemeSettings } from "styles/colorScheme";
import { styles as screenStyles } from "styles/screens";
import { toast } from "utils/toasts";
// @ts-ignore
import { githubUrl, name as appName } from "../../../app.json";
import { version as appVersion } from "../../../package.json";

const styles = StyleSheet.create({
  footer: {
    textAlign: "center",
  },
  footerLink: {
    color: Colors.blue500,
  },
  picker: {
    marginBottom: 12,
  },
  pickerLabel: {
    marginBottom: 2,
    paddingHorizontal: 15,
  },
});

const onPressGHLink = () => Linking.openURL(githubUrl);

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

  const theme = useTheme();
  const { preferredColorScheme, setColorScheme } = useColorSchemeSettings();

  const onPickerChangeColorScheme = useCallback(
    (itemValue: ColorSchemeName | "") => setColorScheme(itemValue || null),
    [setColorScheme]
  );

  const onPickerChangeLanguage = useCallback(
    (itemValue: string) => changeLanguage(itemValue),
    []
  );

  return (
    <ScrollView style={screenStyles.root}>
      <List.Section>
        <List.Subheader>{t("settings.title_general")}</List.Subheader>
        <View
          style={[
            styles.picker,
            {
              backgroundColor: theme.colors.background,
            },
          ]}
        >
          <Caption style={styles.pickerLabel}>{t("language.title")}</Caption>
          <Picker
            selectedValue={i18n.language}
            onValueChange={onPickerChangeLanguage}
            accessibilityLabel={t("language.title")}
            dropdownIconColor={theme.colors.text}
          >
            {supportedLngs.map((lng) => (
              <Picker.Item
                key={lng}
                label={t(`language.${lng}`)}
                value={lng}
                color={theme.colors.text}
              />
            ))}
          </Picker>
        </View>
        <View
          style={[
            styles.picker,
            {
              backgroundColor: theme.colors.background,
            },
          ]}
        >
          <Caption style={styles.pickerLabel}>
            {t("settings.color_scheme.title")}
          </Caption>
          <Picker
            selectedValue={preferredColorScheme || ""}
            onValueChange={onPickerChangeColorScheme}
            accessibilityLabel={t("settings.color_scheme.title")}
            dropdownIconColor={theme.colors.text}
          >
            <Picker.Item
              color={theme.colors.text}
              label={t("settings.color_scheme.follow_system")}
              value=""
            />
            <Picker.Item
              color={theme.colors.text}
              label={t("settings.color_scheme.light")}
              value="light"
            />
            <Picker.Item
              color={theme.colors.text}
              label={t("settings.color_scheme.dark")}
              value="dark"
            />
          </Picker>
        </View>
      </List.Section>
      <List.Section>
        <List.Subheader>{t("settings.title_data")}</List.Subheader>
        <List.Item
          onPress={onExport}
          disabled={loading}
          title={t("settings.export.title")}
        />
        <List.Item
          onPress={onImport}
          disabled={loading}
          title={t("settings.import.title")}
        />
        <List.Item
          titleStyle={{ color: Colors.red400 }}
          onPress={onDelete}
          disabled={loading}
          title="Reset"
        />
      </List.Section>
      <Caption style={styles.footer}>
        {appName} v{appVersion}{" "}
        <Text onPress={onPressGHLink} style={styles.footerLink}>
          GitHub
        </Text>
      </Caption>
    </ScrollView>
  );
};
