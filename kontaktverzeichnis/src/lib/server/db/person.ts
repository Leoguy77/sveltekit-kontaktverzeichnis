import sql from "mssql"

export async function createPerson() {}

export async function readPerson() {}

export async function updatePerson() {}

export async function deletePerson(personId: number, transaction: sql.Transaction) {
  let request = new sql.Request(transaction)

  request.input("val0", sql.Int, personId)

  await request.query(`EXEC deletePerson @val0`)
}
