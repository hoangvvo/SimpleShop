import { SQLiteDatabase } from "react-native-sqlite-storage";
import * as queries from "./queries.sql";
import { Customer } from "./types";

export class CustomerService {
  static async findAll(db: SQLiteDatabase) {
    const result = await db.executeSql(queries.customerFindAll);
    return result[0].rows.raw() as Customer[];
  }

  static async findById(db: SQLiteDatabase, id: Customer["id"]) {
    const result = await db.executeSql(queries.customerFindById, [id]);
    return (result[0].rows.item(0) || null) as Customer | null;
  }

  static async create(db: SQLiteDatabase, input: Omit<Customer, "id">) {
    const result = await db.executeSql(queries.customerCreate, [
      input.name,
      input.loc_text,
      input.note,
    ]);
    return result[0];
  }

  static async update(
    db: SQLiteDatabase,
    id: Customer["id"],
    input: Omit<Customer, "id">
  ) {
    const result = await db.executeSql(queries.customerUpdate, [
      input.name,
      input.loc_text,
      input.note,
      id,
    ]);
    return result[0];
  }

  static async delete(db: SQLiteDatabase, id: Customer["id"]) {
    const result = await db.executeSql(queries.customerDelete, [id]);
    return result[0];
  }
}
