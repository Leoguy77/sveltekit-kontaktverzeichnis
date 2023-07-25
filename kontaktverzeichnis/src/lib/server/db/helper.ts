import sql from "mssql"

/**
 returns the `id` of the inserted row
 */
export async function insertRow(
  tableName: string,
  columns: string[],
  values: (string | null | number)[],
  transaction?: sql.Transaction
) {
  if (columns.length != values.length) {
    throw new Error("DB Insert: columns and values must have the same length")
  }
  let request: sql.Request
  if (transaction) {
    request = new sql.Request(transaction)
  } else {
    request = new sql.Request()
  }

  let colomnString = columns.join(",")
  let valueString = columns.map((v) => "@" + v).join(",")
  for (let i = 0; i < columns.length; i++) {
    request.input(columns[i], values[i])
  }
  let id = await request.query(`INSERT INTO ${tableName} (${colomnString}) OUTPUT Inserted.ID VALUES (${valueString})`)
  return id.recordset[0].ID
}

export async function updateRow(
  tableName: string,
  columns: string[],
  id: number,
  newValues: (string | null | number)[],
  transaction: sql.Transaction
) {
  if (columns.length != newValues.length) {
    throw new Error("DB Insert: columns and values must have the same length")
  }

  let request = new sql.Request(transaction)

  let setString = ""
  for (let i = 0; i < columns.length; i++) {
    request.input(columns[i], newValues[i])
    setString += columns[i] + "=@" + columns[i] + ","
  }
  setString = setString.substring(0, setString.length - 1)

  request.input("id", sql.Int, id)

  await request.query(`UPDATE ${tableName} SET ${setString} WHERE id=@id`)
}

export async function deleteRow(tableName: string, id: number, transaction: sql.Transaction) {
  let request = new sql.Request(transaction)

  request.input("val0", sql.Int, id)

  await request.query(`DELETE FROM ${tableName} WHERE id=@val0`)
}

export async function deleteJunction(tableName: string, columns: string[], id1: number, id2: number, transaction: sql.Transaction) {
  if (columns.length != 2) {
    throw new Error("DB Junction Delete: columns and values must have the same length")
  }

  let request = new sql.Request(transaction)

  request.input("val0", sql.Int, id1)
  request.input("val1", sql.Int, id2)

  await request.query(`DELETE FROM ${tableName} WHERE ${columns[0]}=@val0 and ${columns[1]}=@val1`)
}

export async function insertJunction(tableName: string, columns: string[], id1: number, id2: number, transaction: sql.Transaction) {
  if (columns.length != 2) {
    throw new Error("DB Junction Insert: columns and values must have the same length")
  }

  let request = new sql.Request(transaction)

  request.input("val0", sql.Int, id1)
  request.input("val1", sql.Int, id2)

  await request.query(`INSERT INTO ${tableName} (${columns.join(",")}) VALUES (@val0, @val1)`)
}

export async function bulkInsert(
  tableName: string,
  columns: [string, boolean][],
  values: (string | null)[][],
  db: sql.ConnectionPool
) {
  let table = new sql.Table(tableName)
  table.create = false
  for (let column of columns) {
    table.columns.add(column[0], sql.VarChar, { nullable: column[1] })
  }

  for (let row of values) {
    table.rows.add(...row)
  }
  let request = new sql.Request(db)
  let query = await request.query(`SELECT IDENT_CURRENT('${tableName}') as id`)
  let minId = Number(query.recordset[0].id) + 1

  request = new sql.Request(db)
  let res = await request.bulk(table)

  let ids = []
  for (let i = minId; i < minId + res.rowsAffected; i++) {
    ids.push(i)
  }

  return ids
}
