export const customerFindAll = `
SELECT
  *
FROM
  "customer"
`;

export const customerFindById = `
SELECT
  *
FROM
  "customer"
WHERE
  id = ?
`;

export const customerCreate = `
INSERT INTO
  "customer" (
    name,
    loc_text,
    note
  )
VALUES
  (?, ?, ?)
`;

export const customerUpdate = `
UPDATE
  "customer"
SET
  name = ?,
  loc_text = ?,
  note = ?
WHERE
  id = ?
`;

export const customerDelete = `
DELETE FROM
  "customer"
WHERE
  id = ?
`;
