import { Platform } from "react-native";
import RNFS, { readFile } from "react-native-fs";
import Share from "react-native-share";
import type { DatabaseParams } from "react-native-sqlite-storage";
import SQLite from "react-native-sqlite-storage";
import migrationCustomer from "./migrations/customer.sql";
import migrationInit from "./migrations/init.sql";

SQLite.enablePromise(true);
const dbName = "simple_shop.db";
const dbDir =
  Platform.OS === "android"
    ? `${RNFS.DocumentDirectoryPath.replace("files", "databases")}/`
    : `${RNFS.LibraryDirectoryPath}/LocalDatabase/`;
const dbPath = `${dbDir}${dbName}`;
const dbParams: DatabaseParams = {
  name: dbName,
  location: "default",
};

const migrations = [migrationInit, migrationCustomer];
const initDBPromise = (async () => {
  const db = await SQLite.openDatabase(dbParams);
  try {
    await db.executeSql(`
CREATE TABLE IF NOT EXISTS migrations (
  id INTEGER PRIMARY KEY NOT NULL,
  migration INTEGER NOT NULL DEFAULT -1
)`);
    const indexResult = await db.executeSql(
      `SELECT migration FROM "migrations" WHERE id = 1`
    );
    const migratedIndex = indexResult[0].rows?.item(0)?.migration ?? -1;
    await db.transaction((tx) => {
      migrations.forEach((migration, index) => {
        if (index <= migratedIndex) return;
        migration.split(`\n\n`).forEach((statement) => {
          statement = statement.trim();
          if (statement) tx.executeSql(statement);
        });
      });
      tx.executeSql(
        `REPLACE INTO "migrations" (id, migration)
VALUES (1, ?)`,
        [migrations.length - 1]
      );
    });
  } catch (e) {
    return { db, error: e };
  }
  return { db, error: null };
})();

export const initDb = async () => {
  return initDBPromise;
};

export const deleteDb = async () => {
  // we only archive not delete
  // await SQLite.deleteDatabase(dbParams);
  const archivedDbPath = `${dbPath}.${Date.now()}.old`;
  await RNFS.copyFile(dbPath, archivedDbPath);
  await SQLite.deleteDatabase(dbParams);
};

export const importDb = async (fileCopyUri: string) => {
  await deleteDb();
  await RNFS.copyFile(fileCopyUri, dbPath);
};

export const exportDb = async () => {
  const dbBase64 = await readFile(dbPath, "base64");
  // FIXME: on android, this is not recognized so the extension turned into .null
  const mimeType = `data:application/vnd.sqlite3`;
  return Share.open({
    url: `${mimeType};base64,${dbBase64}`,
    filename: `${dbName.replace("db", "")}${Date.now()}.db`,
    type: mimeType,
  }).then(
    () => true,
    () => false
  );
};
