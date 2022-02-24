import { createContext, useContext, useEffect, useState } from "react";
import type SQLite from "react-native-sqlite-storage";
import { initDb } from "./sqlite";

export const SQLiteContext = createContext({} as SQLite.SQLiteDatabase);

export const useSQLiteInit = (onError: (error: Error) => void) => {
  const [sqlite, setSqlite] = useState<SQLite.SQLiteDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!sqlite) {
      setLoading(true);
      initDb()
        .then(({ db, error }) => {
          setSqlite(db);
          if (error) onError(error as Error);
        }, onError)
        .finally(() => setLoading(false));
    }
  }, [onError, sqlite]);
  return [loading, sqlite] as const;
};

export const useSQLite = () => useContext(SQLiteContext);
