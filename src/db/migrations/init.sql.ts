export default `
CREATE TABLE IF NOT EXISTS product (
  id INTEGER PRIMARY KEY autoincrement,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(256) NULL,
  default_sell_price DECIMAL(12, 2) NOT NULL CHECK(default_sell_price >= 0),
  default_buy_price DECIMAL(12, 2) NOT NULL CHECK(default_buy_price >= 0)
)

CREATE TABLE IF NOT EXISTS "order" (
  id INTEGER PRIMARY KEY autoincrement,
  is_buy_order BOOLEAN NOT NULL,
  loc_text VARCHAR(100) NULL,
  note VARCHAR(256) NULL,
  has_paid BOOLEAN NOT NULL DEFAULT FALSE,
  has_delivered BOOLEAN NOT NULL DEFAULT FALSE,
  created_at INTEGER NOT NULL
)

CREATE TABLE IF NOT EXISTS order_product (
  order_id INTERGER NOT NULL,
  product_id INTEGER NOT NULL,
  per_price DECIMAL(12, 2) NOT NULL CHECK(per_price >= 0),
  amount INTEGER NOT NULL CHECK(amount >= 0),
  FOREIGN KEY (order_id) REFERENCES "order(id)" ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
  UNIQUE(order_id,product_id)
)
`;
