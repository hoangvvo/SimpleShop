import { Platform } from "react-native";
import RNFS from "react-native-fs";
import SQLite, { DatabaseParams } from "react-native-sqlite-storage";
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
  await SQLite.deleteDatabase(dbParams);
};
