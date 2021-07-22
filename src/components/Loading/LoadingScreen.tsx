import { FC } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Colors } from "react-native-paper";

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});

export const LoadingScreen: FC = () => {
  return (
    <View style={styles.root}>
      <ActivityIndicator size="large" animating={true} color={Colors.blue400} />
    </View>
  );
};
