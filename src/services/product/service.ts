import { SQLiteDatabase } from "react-native-sqlite-storage";
import * as queries from "./queries.sql";
import { Product } from "./types";

export class ProductService {
  static async findAll(db: SQLiteDatabase) {
    const result = await db.executeSql(queries.productFindAll);
    return result[0].rows.raw() as Product[];
  }

  static async findById(db: SQLiteDatabase, id: Product["id"]) {
    const result = await db.executeSql(queries.productFindById, [id]);
    return (result[0].rows.item(0) || null) as Product | null;
  }

  static async create(db: SQLiteDatabase, input: Omit<Product, "id">) {
    const result = await db.executeSql(queries.productCreate, [
      input.name,
      input.description,
      input.default_sell_price,
      input.default_buy_price,
    ]);
    return result[0];
  }

  static async update(
    db: SQLiteDatabase,
    id: Product["id"],
    input: Omit<Product, "id">
  ) {
    const result = await db.executeSql(queries.productUpdate, [
      input.name,
      input.description,
      input.default_sell_price,
      input.default_buy_price,
      id,
    ]);
    return result[0];
  }

  static async delete(db: SQLiteDatabase, id: Product["id"]) {
    const result = await db.executeSql(queries.productDelete, [id]);
    return result[0];
  }
}
