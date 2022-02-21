import { Platform } from "react-native";
import RNFS from "react-native-fs";
import SQLite, { DatabaseParams } from "react-native-sqlite-storage";
import {
  order as orderSchema,
  orderProducts as orderProductsSchema,
} from "services/order/schema.sql";
import { default as productSchema } from "services/product/schema.sql";

SQLite.enablePromise(true);
const dbName = "simple_shop.db";
const dbParams: DatabaseParams = {
  name: dbName,
  location: "default",
};
const dbDir =
  Platform.OS === "android"
    ? `${RNFS.DocumentDirectoryPath.replace("files", "databases")}/`
    : `${RNFS.LibraryDirectoryPath}/LocalDatabase/`;
const dbPath = `${dbDir}${dbName}`;

const initDBPromise = (async () => {
  const initSchemas = [productSchema, orderSchema, orderProductsSchema];
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
  await RNFS.moveFile(dbPath, archivedDbPath);
};

export const importDb = async (fileCopyUri: string) => {
  await deleteDb();
  await RNFS.copyFile(fileCopyUri, dbPath);
};

export const exportDb = async () => {
  if (Platform.OS === "ios") throw new Error("Not implemented");
  const copyToPath = `${RNFS.DownloadDirectoryPath}/${Date.now()}_${dbName}`;
  await RNFS.copyFile(dbPath, copyToPath);
  return copyToPath;
};
