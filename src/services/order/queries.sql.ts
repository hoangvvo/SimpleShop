export const orderFindAll = `
SELECT
  *
FROM
  "order"
`;

export const orderFindById = `
SELECT
  *
FROM
  "order"
WHERE
  id = ?
`;

export const orderProductFindByOrderId = `
SELECT
  *
FROM
  order_product
WHERE
  order_id = ?
`;

export const orderCreate = `
INSERT INTO
  "order" (
    is_buy_order,
    loc_text,
    note,
    has_paid,
    has_delivered,
    created_at
  )
VALUES
  (?, ?, ?, ?, ?, datetime('now'))
`;

export const orderUpdate = `
UPDATE
  "order"
SET
  loc_text = ?,
  note = ?,
  has_paid = ?,
  has_delivered = ?
WHERE
  id = ?
`;

export const orderProductFindAll = `
SELECT
  *
FROM
  order_product
`;

export const orderProductsDrop = `
DELETE FROM
  order_product
WHERE
  order_id = ?
`;

export const orderProductsInsert = (length: number) => `
INSERT INTO
  order_product (order_id, product_id, per_price, amount)
VALUES
  ${`(?, ?, ?, ?),`.repeat(length).slice(0, -1)}
`;

export const orderDelete = `
DELETE FROM 
  "order" 
WHERE 
  id = ?
`;
