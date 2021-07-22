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
  return (
    <Appbar.Header
      style={[styles.root, { backgroundColor: options.headerTintColor }]}
      statusBarHeight={StatusBar.currentHeight}
    >
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={options.headerTitle} />
      {options.headerRight && options.headerRight({})}
    </Appbar.Header>
  );
};
