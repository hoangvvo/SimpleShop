export default `
CREATE TABLE IF NOT EXISTS customer (
  id INTEGER PRIMARY KEY autoincrement,
  name VARCHAR(256) NOT NULL,
  loc_text VARCHAR(256) NULL,
  note VARCHAR(256) NULL
)

ALTER TABLE 
  "order" 
ADD 
  customer_id INTEGER NULL REFERENCES customer(id) ON DELETE SET NULL
`;
