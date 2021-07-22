import { useTheme } from "@react-navigation/native";
import { StackHeaderProps } from "@react-navigation/stack";
import { FC } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";

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
          backgroundColor: !theme.dark ? options.headerTintColor : undefined,
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
