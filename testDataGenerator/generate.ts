import { faker } from "@faker-js/faker"
import sql from "mssql"
import commandLineArgs from "command-line-args"
import db from "../kontaktverzeichnis/src/lib/server/db.js"

const optionDefinitions = [
  { name: "verbose", alias: "v", type: Boolean },
  { name: "count", alias: "c", type: Number, defaultOption: true, defaultValue: 10 },
]

const options = commandLineArgs(optionDefinitions)

// Consts
const departments = [
  ["Personalabteilung"],
  ["Controlling"],
  ["Vorstand"],
  ["Empfang"],
  ["Informationstechnologie"],
  ["Produktentwicklung"],
  ["Fuhrparkverwaltung"],
  ["Marketing"],
  ["Unternehmenskommunikation"],
  ["Vertrieb"],
  ["Kundenbetreuung"],
  ["Rechnungswesen"],
  ["Finanzbuchhaltung"],
]
const phonetyps = [["Festnetz"], ["Mobil"], ["Fax"], ["DECT"]]

const locations = [
  ["Berlin", "0302-1132"],
  ["Hamburg", "040-45561"],
  ["München", "0501-7856"],
  ["Köln", "06412-3498"],
]

const costunits = ["11111", "22222", "33333", "44444", "55555"]

// Helper functions
async function bulkInsert(tableName: string, columns: [string, boolean][], values: (string | undefined)[][]) {
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

async function insertRow(tableName: string, columns: string[], values: (string | undefined | number)[], transaction: sql.Transaction) {
  if (columns.length != values.length) {
    throw new Error("DB Insert: columns and values must have the same length")
  }

  let request = new sql.Request(transaction)

  let colomnString = columns.join(",")
  let valueString = columns.map((v) => "@" + v).join(",")
  for (let i = 0; i < columns.length; i++) {
    request.input(columns[i], values[i])
  }
  let id = await request.query(`INSERT INTO ${tableName} (${colomnString}) OUTPUT Inserted.ID VALUES (${valueString})`)
  return id.recordset[0].ID
}

async function updateRow(
  tableName: string,
  columns: string[],
  id: number,
  newValues: (string | undefined | number)[],
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

async function deleteRow(tableName: string, id: number, transaction: sql.Transaction) {
  let request = new sql.Request(transaction)

  request.input("val0", sql.Int, id)

  await request.query(`DELETE FROM ${tableName} WHERE id=@val0`)
}

async function deletePerson(personId: number, transaction: sql.Transaction) {
  let request = new sql.Request(transaction)

  request.input("val0", sql.Int, personId)

  await request.query(`EXEC deletePerson @val0`)
}

async function deleteJunction(tableName: string, columns: string[], id1: number, id2: number, transaction: sql.Transaction) {
  if (columns.length != 2) {
    throw new Error("DB Junction Delete: columns and values must have the same length")
  }

  let request = new sql.Request(transaction)

  request.input("val0", sql.Int, id1)
  request.input("val1", sql.Int, id2)

  await request.query(`DELETE FROM ${tableName} WHERE ${columns[0]}=@val0 and ${columns[1]}=@val1`)
}

async function insertJunction(tableName: string, columns: string[], id1: number, id2: number, transaction: sql.Transaction) {
  if (columns.length != 2) {
    throw new Error("DB Junction Insert: columns and values must have the same length")
  }

  let request = new sql.Request(transaction)

  request.input("val0", sql.Int, id1)
  request.input("val1", sql.Int, id2)

  await request.query(`INSERT INTO ${tableName} (${columns.join(",")}) VALUES (@val0, @val1)`)
}

// Tools
function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

async function runRandomTimes(min: number, max: number, func: () => Promise<any>) {
  let times = Math.floor(Math.random() * max + min)
  let result = []
  for (let i = 0; i < times; i++) {
    let res = await func()
    result.push(res)
  }
  return result
}

// Random data insert functions
async function initData() {
  let abteilungIds = bulkInsert("abteilung", [["bezeichnung", false]], departments)

  let eintragTypIds = bulkInsert("eintragTyp", [["bezeichnung", false]], phonetyps)

  let standortIds = bulkInsert(
    "standort",
    [
      ["bezeichnung", false],
      ["vorwahl", true],
    ],
    locations
  )

  return await Promise.all([abteilungIds, eintragTypIds, standortIds])
}

async function createRandomPhoneNummer(ranStandortIds: number[], personId: number, transaction: sql.Transaction) {
  const standort = faker.helpers.arrayElement(ranStandortIds)
  const vorwahl = locations[standortIds.indexOf(standort)][1]
  const eintragTyp = faker.helpers.arrayElement(eintragTypIds)

  const telNumber = faker.phone.number(vorwahl + "-" + "#".repeat(randomIntFromInterval(1, 5)))

  const telefonEintragId = await insertRow(
    "telefonEintrag",
    ["eintragTypId", "nummer", "standortID"],
    [eintragTyp, telNumber, standort],
    transaction
  )

  await insertJunction("telefonEintragperson", ["telefonEintragID", "personID"], telefonEintragId, personId, transaction)
}

async function createRandomPerson() {
  let transaction = new sql.Transaction(db)
  let res = await transaction.begin()
  let request = new sql.Request(transaction)

  try {
    //Person
    const vorname = faker.name.firstName()
    const nachname = faker.name.lastName()
    const personalNummer = randomIntFromInterval(1, 99999)
    const kostenstelle = faker.helpers.arrayElement(costunits)
    const email = `${vorname}.${nachname}@firma.de`
    const titel = faker.helpers.maybe<string>(() => faker.helpers.arrayElement(["Dr.", "Prof.", "Dr. med.", "Prof. Dr."]), {
      probability: 0.1,
    })

    const personId = await insertRow(
      "person",
      ["vorname", "nachname", "personalNummer", "kostenstelle", "email", "titel"],
      [vorname, nachname, personalNummer.toString(), kostenstelle, email, titel],
      transaction
    )

    //Abteilungen
    let abteilungen = faker.helpers.arrayElements(abteilungIds, randomIntFromInterval(1, 4))
    for (let abteilungId of abteilungen) {
      await insertJunction("personabteilung", ["abteilungID", "personID"], abteilungId, personId, transaction)
    }

    //Standorte
    let standorte = faker.helpers.arrayElements(standortIds, randomIntFromInterval(1, 3))
    for (let standortId of standorte) {
      await insertJunction("standortperson", ["standortID", "personID"], standortId, personId, transaction)
    }

    //Telefonnummern
    await runRandomTimes(1, 7, async () => {
      await createRandomPhoneNummer(standorte, personId, transaction)
    })

    await transaction.commit()
  } catch (err) {
    console.log(err)
    await transaction.rollback()
  }
}

// Main
var [abteilungIds, eintragTypIds, standortIds]: [number[], number[], number[]] = [[], [], []]
async function main() {
  console.log("start")
  let res = await initData()
  abteilungIds = res[0]
  eintragTypIds = res[1]
  standortIds = res[2]

  // random person
  let jobarr = []
  for (let i = 0; i < options.count; i++) {
    jobarr.push(createRandomPerson())
  }
  await Promise.all(jobarr)

  // random ressource

  console.log("done")
  await db.close()
}

main()

// -------------------------

// async function getDepartment(): Promise<string> {
//   let department: string = getRandomItem(departmentIds)
//   return department
// }

// async function createRandomPerson() {
//   const firstName = faker.name.firstName()
//   const lastName = faker.name.lastName()
//   const email = `${firstName}.${lastName}@meinefirma.de`
//   const phoneNumber = await runRandomTimes(1, 6, createRandomPhoneNummer)
//   const title = faker.helpers.maybe<string>(() => faker.helpers.arrayElement(["Dr.", "Prof.", "Dr. med.", "Prof. Dr."]), {
//     probability: 0.1,
//   })
//   const abteilung = await runRandomTimes(1, 4, getDepartment)
//   const randomLocation = await getRandomItem(locationIds)
//   const location = randomLocation.id

//   const user = await pb.collection("person").create({
//     vorname: firstName,
//     nachname: lastName,
//     titel: title,
//     email: email,
//     telefonEintraege: phoneNumber,
//     abteilungen: abteilung,
//     standort: location,
//     secureData: await createRandomSecureData(),
//   })
//   return user
// }

// async function createRandomResource() {
//   const bezeichner = faker.random.word()
//   const abteilungen = await runRandomTimes(1, 4, getDepartment)
//   const standort = await getRandomItem(locationIds).id
//   const telefonEintraege = await runRandomTimes(1, 6, createRandomPhoneNummer)

//   const email = `${bezeichner}@meinefirma.de`

//   const resource = await pb.collection("ressource").create({
//     bezeichner: bezeichner,
//     abteilungen: abteilungen,
//     standort: standort,
//     telefonEintraege: telefonEintraege,
//     email: email,
//   })
//   return resource
// }

// function ifNotEmpty(value: string): string {
//   if (value) {
//     return value + " "
//   }
//   return ""
// }

// function makeIterable(value: any): any {
//   if (typeof value[Symbol.iterator] === "function") {
//     return value
//   }
//   return [value]
// }

// async function createEmptyResource() {
//   const resource = await pb.collection("ressource").create({})
// }

// async function createEmptyUser() {
//   const user = await pb.collection("person").create({
//     vorname: "Max",
//     nachname: "Mustermann",
//   })
// }

// for (let index = 0; index < options.count; index++) {
//   let user = await createRandomPerson()
//   if (options.verbose) {
//     console.log(user)
//   }
// }
// for (let index = 0; index < options.count; index++) {
//   let resource = await createRandomResource()
//   if (options.verbose) {
//     console.log(resource)
//   }
// }
// //createEmptyResource();
// //createEmptyUser();
// //createPersonIndex("pwyy0zju75trv3e");
