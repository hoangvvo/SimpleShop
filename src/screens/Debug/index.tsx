import { toast } from "components/Toast";
import { useSQLite } from "db";
import type { FC } from "react";
import { useState } from "react";
import { ScrollView } from "react-native";
import { Button, Caption, Divider, TextInput } from "react-native-paper";

const DebugScreen: FC = () => {
  const sqlite = useSQLite();

  const [sqlStatement, setSqlStatement] = useState("");
  const [lastOutput, setLastOutput] = useState("");

  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    try {
      let output: string = "";

      await sqlite.transaction((tx) => {
        sqlStatement.split(`\n\n`).forEach((statement) => {
          statement = statement.trim();
          if (statement) {
            tx.executeSql(statement, [], (_tx, result) => {
              output += JSON.stringify(result.rows.raw(), null, 4) + "\n\n";
            });
          }
        });
      });

      setLastOutput(output);
    } catch (e: any) {
      toast.error(e.message);
      setLastOutput(e.message);
    }
    setLoading(false);
  };

  return (
    <>
      <TextInput
        value={sqlStatement}
        onChangeText={setSqlStatement}
        numberOfLines={6}
        multiline
      />
      <Button onPress={onSubmit} disabled={loading}>
        Execute
      </Button>
      <Divider />
      <ScrollView style={{ flex: 1 }}>
        <Caption>{lastOutput}</Caption>
      </ScrollView>
    </>
  );
};

export default DebugScreen;
