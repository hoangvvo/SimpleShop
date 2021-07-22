import { Platform } from "react-native";
import RNFS from "react-native-fs";
import SQLite, {
  DatabaseParams,
  SQLiteDatabase,
} from "react-native-sqlite-storage";
import {
  order as orderSchema,
  orderProducts as orderProductsSchema,
} from "services/order/schema.sql";
import { default as productSchema } from "services/product/schema.sql";

export const dbName = "simple_shop.db";

SQLite.enablePromise(true);

const initSchemas = [productSchema, orderSchema, orderProductsSchema];

export const dbParams: DatabaseParams = {
  name: dbName,
  location: "default",
};

export const dbPath =
  Platform.OS === "android"
    ? `${RNFS.DocumentDirectoryPath.replace("files", "databases")}/${dbName}`
    : `${RNFS.LibraryDirectoryPath}/LocalDatabase/${dbName}`;

let db: SQLiteDatabase;

export const initDb = async () => {
  if (db) return db;

  const _db = await SQLite.openDatabase(dbParams);

  await _db.transaction((tx) => {
    for (const initSchema of initSchemas) {
      tx.executeSql(initSchema);
    }
  });

  return (db = _db);
};

export const deleteDb = async () => {
  await db.close();
  await SQLite.deleteDatabase(dbParams);
};
