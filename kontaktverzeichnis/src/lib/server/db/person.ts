import sql from "mssql"
import type { Person } from "./dataTypes.ts"
import { insertRow, insertJunction } from "./helper.ts"

export async function createPerson(person: Person, transaction: sql.Transaction) {
  let request = new sql.Request(transaction)
  let personColumns = ["id", "vorname", "nachname", "personalnummer", "konstenstelle", "email", "titel"]
  let personValues = [
    person.id,
    person.vorname,
    person.nachname,
    person.personalnummer,
    person.konstenstelle,
    person.email,
    person.titel,
  ]
  let personId = await insertRow("person", personColumns, personValues)

  for (let abteilung of person.abteilung) {
    await insertJunction("personabteilung", ["abteilungID", "personID"], abteilung.id, personId, transaction)
  }

  for (let standort of person.standort) {
    await insertJunction("standortperson", ["standortID", "personID"], standort.id, personId, transaction)
  }

  for (let telefonEintrag of person.telefonEintrag) {
    let telefonEintragId = await insertRow(
      "telefonEintrag",
      ["id", "eintragTypID", "nummer", "standortID"],
      [telefonEintrag.id, telefonEintrag.eintragTyp.id, telefonEintrag.nummer, telefonEintrag.standort?.id]
    )
    await insertJunction("telefonEintragperson", ["telefonEintragID", "personID"], telefonEintragId, personId, transaction)
  }
}

export async function readPerson(person: Person, transaction: sql.Transaction) {
  // let request = new sql.Request(transaction)
  // request.input("val0", sql.Int, personId)
  // await request.query(`EXEC deletePerson @val0`)
}

export async function updatePerson(transaction: sql.Transaction) {}

export async function deletePerson(personId: number, transaction: sql.Transaction) {
  let request = new sql.Request(transaction)

  request.input("val0", sql.Int, personId)

  await request.query(`EXEC deletePerson @val0`)
}
