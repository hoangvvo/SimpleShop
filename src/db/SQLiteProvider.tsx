import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type SQLite from "react-native-sqlite-storage";
import { initDb } from "./sqlite";

export const SQLiteContext = createContext({} as SQLite.SQLiteDatabase);

export const useSQLiteInit = (onError: (error: Error) => void) => {
  const [sqlite, setSqlite] = useState<SQLite.SQLiteDatabase | null>(null);
  const loading = useMemo(() => !sqlite, [sqlite]);
  useEffect(() => {
    if (!sqlite) {
      initDb().then(setSqlite, onError);
    }
  }, [onError, sqlite]);
  return [loading, sqlite] as const;
};

export const useSQLite = () => useContext(SQLiteContext);
