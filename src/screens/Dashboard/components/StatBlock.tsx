import type { FC } from "react";
import { StyleSheet } from "react-native";
import { Card, Colors, Text } from "react-native-paper";

const styles = StyleSheet.create({
  stat: {
    flex: 1,
    padding: 12,
  },
  statLabel: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 0,
  },
  statTime: {
    fontSize: 12,
    marginBottom: 6,
  },
  statValue: {
    color: Colors.blue400,
    fontSize: 27,
    fontWeight: "bold",
  },
});

const StatBlock: FC<{
  onPress?(): void;
  value: number | string;
  title: string;
  subtitle: string;
}> = ({ onPress, title, subtitle, value }) => {
  return (
    <Card style={styles.stat} onPress={onPress}>
      <Text style={styles.statLabel}>{title}</Text>
      <Text style={styles.statTime}>{subtitle}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </Card>
  );
};
export default StatBlock;
