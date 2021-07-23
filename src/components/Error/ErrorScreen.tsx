import Clipboard from "@react-native-clipboard/clipboard";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar, Caption, Colors, Paragraph, Title } from "react-native-paper";

const styles = StyleSheet.create({
  icon: {
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  paragraph: {
    marginBottom: 4,
    textAlign: "center",
  },
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.grey200,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    marginBottom: 8,
  },
});

export const ErrorScreen: FC<{ error: Error }> = ({ error }) => {
  const { t } = useTranslation();
  const onLongPress = useCallback(() => {
    Clipboard.setString(error.stack || error.message);
  }, [error]);

  return (
    <View style={styles.root}>
      <Avatar.Icon
        style={styles.icon}
        color={Colors.red400}
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
