import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { toast } from "components/Toast";
import { deleteDb, exportDb, importDb } from "db/sqlite";
import { supportedLngs } from "locales/constants";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { ColorSchemeName } from "react-native";
import { Alert, Linking, Pressable, StyleSheet, View } from "react-native";
import DocumentPicker from "react-native-document-picker";
import { ScrollView } from "react-native-gesture-handler";
import { Caption, Colors, List, Text, useTheme } from "react-native-paper";
// @ts-ignore
import RNRestart from "react-native-restart";
import { useMutation } from "react-query";
import type { ParamList } from "screens/types";
import { RouteName } from "screens/types";
import { styles as screenStyles } from "styles/screens";
import { supportedCurrencies } from "utils/currency";
import type { SettingsValues } from "utils/settings";
import { useSettings } from "utils/settings";
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

const SettingsScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.Settings>
> = () => {
  const { t } = useTranslation();

  const { isLoading: isLoadingDelete, mutate: mutateDelete } = useMutation(
    deleteDb,
    {
      onError(error: any) {
        toast.error(error.message);
      },
      onSuccess() {
        RNRestart.Restart();
      },
    }
  );
  const onDelete = () => {
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
          onPress: () => mutateDelete(),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const { isLoading: isLoadingImport, mutate: mutateImport } = useMutation(
    importDb,
    {
      onError(error: any) {
        toast.error(error.message);
      },
      onSuccess() {
        RNRestart.Restart();
      },
    }
  );
  const onImport = async () => {
    try {
      const { fileCopyUri } = await DocumentPicker.pickSingle({
        type: DocumentPicker.types.allFiles,
        copyTo: "cachesDirectory",
      });
      if (!fileCopyUri) return;
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
            onPress: () => mutateImport(fileCopyUri),
          },
        ],
        { cancelable: true }
      );
    } catch (e) {
      /* noop: user cancelled */
    }
  };

  const { isLoading: isLoadingExport, mutate: mutateExport } = useMutation(
    exportDb,
    {
      onError(error: any) {
        toast.error(error.message);
      },
      onSuccess(ok) {
        if (ok) toast.success(t("settings.export.ok_message"));
      },
    }
  );
  const onExport = () => mutateExport();

  const theme = useTheme();
  const { value: settingsValues, changeSetting } = useSettings();

  const onPickerChangeColorScheme = (itemValue: ColorSchemeName | "") =>
    changeSetting("colorScheme", itemValue || null);

  const onPickerChangeLanguage = (itemValue: string) =>
    changeSetting(
      "language",
      (itemValue || null) as SettingsValues["language"]
    );

  const onPickerChangeCurrency = (itemValue: string) =>
    changeSetting(
      "currency",
      (itemValue || null) as SettingsValues["currency"]
    );

  const isLoading = isLoadingDelete || isLoadingExport || isLoadingImport;
  const navigation = useNavigation();

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
            selectedValue={settingsValues.language || ""}
            onValueChange={onPickerChangeLanguage}
            accessibilityLabel={t("language.title")}
            dropdownIconColor={theme.colors.text}
          >
            <Picker.Item
              color={theme.colors.text}
              label={t("settings.follow_system")}
              value=""
            />
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
            selectedValue={settingsValues.colorScheme || ""}
            onValueChange={onPickerChangeColorScheme}
            accessibilityLabel={t("settings.color_scheme.title")}
            dropdownIconColor={theme.colors.text}
          >
            <Picker.Item
              color={theme.colors.text}
              label={t("settings.follow_system")}
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
        <View
          style={[
            styles.picker,
            {
              backgroundColor: theme.colors.background,
            },
          ]}
        >
          <Caption style={styles.pickerLabel}>
            {t("settings.currency.title")}
          </Caption>
          <Picker
            selectedValue={settingsValues.currency || ""}
            onValueChange={onPickerChangeCurrency}
            accessibilityLabel={t("settings.currency.title")}
            dropdownIconColor={theme.colors.text}
          >
            <Picker.Item
              color={theme.colors.text}
              label={t("settings.follow_system")}
              value=""
            />
            {supportedCurrencies.map((currency) => (
              <Picker.Item
                key={currency}
                label={currency}
                value={currency}
                color={theme.colors.text}
              />
            ))}
          </Picker>
        </View>
      </List.Section>
      <List.Section>
        <List.Subheader>{t("settings.title_data")}</List.Subheader>
        <List.Item
          onPress={onExport}
          disabled={isLoading}
          title={t("settings.export.title")}
        />
        <List.Item
          onPress={onImport}
          disabled={isLoading}
          title={t("settings.import.title")}
        />
        <List.Item
          titleStyle={{ color: Colors.red400 }}
          onPress={onDelete}
          disabled={isLoading}
          title="Reset"
        />
      </List.Section>
      <Pressable
        onLongPress={() => navigation.navigate(RouteName.Debug)}
        delayLongPress={10000}
      >
        <Caption style={styles.footer}>
          {appName} v{appVersion}{" "}
          <Text onPress={onPressGHLink} style={styles.footerLink}>
            GitHub
          </Text>
        </Caption>
      </Pressable>
    </ScrollView>
  );
};

export default SettingsScreen;
