export const productFindAll = `
SELECT
  *
FROM
  product
`;

export const productFindById = `
SELECT
  *
FROM
  product
WHERE
  id = ?
`;

export const productCreate = `
INSERT INTO
  product (name, description, default_sell_price, default_buy_price)
VALUES
  (?, ?, ?, ?)
`;

export const productUpdate = `
UPDATE
  product
SET
  name = ?,
  description = ?,
  default_sell_price = ?,
  default_buy_price = ?
WHERE
  id = ?
`;

export const productDelete = `
DELETE FROM
  product
WHERE
  id = ?
`;
