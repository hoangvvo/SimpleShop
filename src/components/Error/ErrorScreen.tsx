import Clipboard from "@react-native-clipboard/clipboard";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  Avatar,
  Caption,
  Paragraph,
  Title,
  useTheme,
} from "react-native-paper";

const styles = StyleSheet.create({
  icon: {
    marginBottom: 12,
  },
  paragraph: {
    marginBottom: 4,
    textAlign: "center",
  },
  root: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    marginBottom: 8,
  },
});

export const ErrorScreen: FC<{ error: Error }> = ({ error }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const onLongPress = useCallback(() => {
    Clipboard.setString(error.stack || error.message);
  }, [error]);

  return (
    <View style={styles.root}>
      <Avatar.Icon
        style={[styles.icon, { backgroundColor: theme.colors.error }]}
        size={96}
        icon="alert-circle"
      />
      <Title style={styles.title}>{t("error.something_went_wrong")}</Title>
      <Paragraph style={styles.paragraph}>
        {t("error.general_description")}
      </Paragraph>
      <ScrollView>
        <Caption onLongPress={onLongPress}>{error.stack}</Caption>
      </ScrollView>
    </View>
  );
};
