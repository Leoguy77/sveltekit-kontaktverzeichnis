import { faker } from "@faker-js/faker"
import sql from "mssql"
import type { config } from "mssql"
import dotenv from "dotenv"
import commandLineArgs from "command-line-args"
let env: any
env = dotenv.config({ path: "../.env" })

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

async function dbConnect() {
  // Database connect
  var config: config = {
    server: process.env.DB_SERVER || "",
    user: process.env.DB_USER || "",
    password: process.env.DB_PW || "",
    database: process.env.DB_Name || "",
    port: Number(process.env.DB_Port) || 0,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  }
  const db = await sql.connect(config)
  return db
}

// Helper functions
async function bulkInsert(tableName: string, columns: string[], values: string[][]) {
  let table = new sql.Table(tableName)
  table.create = false
  for (let column of columns) {
    table.columns.add(column, sql.VarChar, { nullable: true })
  }

  for (let row of values) {
    table.rows.add(...row)
  }

  let request = new sql.Request(db)
  let query = await request.query(`SELECT MAX(id) FROM ${tableName}`)
  let minId = Number() + 1

  request = new sql.Request(db)
  let res = await request.bulk(table)

  let ids = []
  for (let i = minId; i < minId + res.rowsAffected; i++) {
    ids.push(minId + i)
  }

  return ids
}

async function insertRow(tableName: string, columns: string[], values: string[]) {
  if (columns.length != values.length) {
    throw new Error("DB Insert: columns and values must have the same length")
  }

  let request = new sql.Request(db)

  let colomnString = columns.join(",")
  let valueString = columns.map((v) => "@" + v).join(",")
  for (let i = 0; i < columns.length; i++) {
    request.input(columns[i], sql.VarChar, values[i])
  }
  let id = await request.query(`INSERT INTO ${tableName} (${colomnString}) OUTPUT Inserted.ID VALUES (${valueString})`)
  return id.recordset[0].ID
}

async function updateRow(tableName: string, columns: string[], id: number, newValues: string[]) {
  if (columns.length != newValues.length) {
    throw new Error("DB Insert: columns and values must have the same length")
  }

  let request = new sql.Request(db)

  let setString = ""
  for (let i = 0; i < columns.length; i++) {
    request.input(columns[i], sql.VarChar, newValues[i])
    setString += columns[i] + "=@" + columns[i] + ","
  }
  setString = setString.substring(0, setString.length - 1)

  request.input("id", sql.Int, id)

  await request.query(`UPDATE ${tableName} SET ${setString} WHERE id=@id`)
}

async function deleteRow(tableName: string, id: number) {
  let request = new sql.Request(db)

  request.input("val0", sql.Int, id)

  await request.query(`DELETE FROM ${tableName} WHERE id=@val0`)
}

async function deleteJunction(tableName: string, columns: string[], id1: number, id2: number) {
  if (columns.length != 2) {
    throw new Error("DB Junction Delete: columns and values must have the same length")
  }
  let request = new sql.Request(db)

  request.input("val0", sql.Int, id1)
  request.input("val1", sql.Int, id2)

  await request.query(`DELETE FROM ${tableName} WHERE ${columns[0]}=@val0 and ${columns[1]}=@val1`)
}

async function insertJunction(tableName: string, columns: string[], id1: number, id2: number) {
  if (columns.length != 2) {
    throw new Error("DB Junction Insert: columns and values must have the same length")
  }
  let request = new sql.Request(db)

  request.input("val0", sql.Int, id1)
  request.input("val1", sql.Int, id2)

  await request.query(`INSERT INTO ${tableName} (${columns.join(",")}) VALUES (@val0, @val1)`)
}

// Tools
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

async function initData() {
  //  departments
  await bulkInsert("abteilung", ["bezeichnung"], departments)
  console.log("departments inserted")

  // phonetyps
  await bulkInsert("eintragTyp", ["bezeichnung"], phonetyps)
  console.log("phonetyps inserted")

  // locations
  let ids = await bulkInsert("standort", ["bezeichnung", "vorwahl"], locations)
  console.log(ids)
  console.log("locations inserted")
}

async function createRandomPerson() {
  const vorname = faker.name.firstName()
  const nachname = faker.name.lastName()
  const email = faker.internet.email(vorname, nachname)
  // const standort = getRandomItem(locationIds)

  // const personId = await insertRow("person", ["vorname", "nachname", "email", "standort"], [vorname, nachname, email, standort.id])

  // return personId
}

// Main
let db: sql.ConnectionPool
let locationIds: number[] = []
async function main() {
  console.log("start")
  db = await dbConnect()
  await initData()

  console.log("done")
  await db.close()
}

main()

// -------------------------

// async function createRandomPhoneNummer() {
//   const standort = getRandomItem(locationIds)

//   const phoneNumber = faker.phone.number(standort.vorwahl + "-" + "#".repeat(randomIntFromInterval(1, 5)))

//   const telefonEintrag: any = await pb.collection("telefonEintrag").create({
//     eintragTyp: getRandomItem(phonetyps),
//     nummer: phoneNumber,
//     standort: standort.id,
//   })

//   return telefonEintrag.id
// }

// async function createRandomSecureData() {
//   const secureData: any = await pb.collection("secureData").create({
//     personalNummer: faker.random.numeric(5),
//     kostenstelle: getRandomItem(costunits),
//   })
//   return secureData.id
// }

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

// async function runRandomTimes(min: number, max: number, func: () => Promise<string>) {
//   let times = Math.floor(Math.random() * max + min)
//   let result: string[] = []
//   for (let i = 0; i < times; i++) {
//     let res: string = await func()
//     result.push(res)
//   }
//   return result
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
