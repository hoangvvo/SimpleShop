import Clipboard from "@react-native-clipboard/clipboard";
import { FC, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  Avatar,
  Caption,
  Paragraph,
  Title,
  TouchableRipple,
  useTheme,
} from "react-native-paper";

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    marginBottom: 8,
  },
  paragraph: {
    textAlign: "center",
    marginBottom: 4,
  },
  stack: {
    height: 128,
    overflow: "hidden",
    position: "absolute",
    bottom: 24,
  },
});

export const ErrorScreen: FC<{ error: Error }> = ({ error }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const onLongPress = useCallback(() => {
    Clipboard.setString(error.stack || error.message);
  }, [error]);

  useEffect(() => {
    console.error(error);
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
      <TouchableRipple style={styles.stack}>
        <ScrollView>
          <Caption onLongPress={onLongPress}>{error.stack}</Caption>
        </ScrollView>
      </TouchableRipple>
    </View>
  );
};
