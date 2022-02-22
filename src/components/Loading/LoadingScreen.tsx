import type { FC } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Colors } from "react-native-paper";

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});

export const LoadingScreen: FC<{ color?: string }> = ({ color }) => {
  return (
    <View style={styles.root}>
      <ActivityIndicator
        size="large"
        animating={true}
        color={color || Colors.blue400}
      />
    </View>
  );
};
