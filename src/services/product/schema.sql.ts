export default `
CREATE TABLE IF NOT EXISTS product (
  id INTEGER PRIMARY KEY autoincrement,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(256) NULL,
  default_sell_price DECIMAL(12, 2) NOT NULL CHECK(default_sell_price >= 0),
  default_buy_price DECIMAL(12, 2) NOT NULL CHECK(default_buy_price >= 0)
)
`;
