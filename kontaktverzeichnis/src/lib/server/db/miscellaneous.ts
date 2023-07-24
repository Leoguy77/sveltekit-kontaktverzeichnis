import sql from "mssql"

export async function readStandorte(db: sql.ConnectionPool) {
  let standorte = (await db.query("SELECT * FROM standort")).recordset
  return standorte[0]
}

export async function readEintragTypen(db: sql.ConnectionPool) {
  let result = await db.query("SELECT * FROM EintragTyp")
  return result.recordset
}

export async function readJSONData(personId: number, transaction: sql.Transaction) {
  let request = new sql.Request(transaction)

  request.input("val0", sql.Int, personId)

  await request.query(`EXEC deletePerson @val0`)
}
