import { StackHeaderProps } from "@react-navigation/stack";
import { FC } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { Appbar, useTheme } from "react-native-paper";

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    justifyContent: "center",
  },
});

export const NavigationBar: FC<StackHeaderProps> = ({
  navigation,
  back,
  options,
}) => {
  const theme = useTheme();

  return (
    <Appbar.Header
      style={[
        styles.root,
        {
          backgroundColor: !theme.dark
            ? options.headerTintColor
            : theme.colors.surface,
        },
      ]}
      statusBarHeight={StatusBar.currentHeight}
    >
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={options.headerTitle} />
      {options.headerRight && options.headerRight({})}
    </Appbar.Header>
  );
};
