import { Platform } from "react-native";
import RNFS, { readFile } from "react-native-fs";
import Share from "react-native-share";
import SQLite, { DatabaseParams } from "react-native-sqlite-storage";
import {
  order as orderSchema,
  orderProducts as orderProductsSchema,
} from "services/order/schema.sql";
import { default as productSchema } from "services/product/schema.sql";

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

const initSchemas = [productSchema, orderSchema, orderProductsSchema];
const initDBPromise = (async () => {
  const db = await SQLite.openDatabase(dbParams);
  await db.transaction((tx) => {
    for (const initSchema of initSchemas) {
      tx.executeSql(initSchema);
    }
  });
  return db;
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
    filename: dbName,
    type: mimeType,
  }).then(
    () => true,
    () => false
  );
};
