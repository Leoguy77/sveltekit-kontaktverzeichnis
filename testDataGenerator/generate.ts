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
  "Personalabteilung",
  "Controlling",
  "Vorstand",
  "Empfang",
  "Informationstechnologie",
  "Produktentwicklung",
  "Fuhrparkverwaltung",
  "Marketing",
  "Unternehmenskommunikation",
  "Vertrieb",
  "Kundenbetreuung",
  "Rechnungswesen",
  "Finanzbuchhaltung",
]
const phonetyps = ["Festnetz", "Mobil", "Fax", "DECT"]

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



async function initData() {
  const table = new sql.Table('abteilung');
  table.create = false; // presuming table already exists
  table.columns.add('departmentName', sql.VarChar, { nullable: true });

  for (let i=0;i<100;i++) {
    table.rows.add(getRandomItem(departments))
  }
  
  const request = new sql.Request(db);
  request.bulk(table, (err, result) => {
    console.log(err)
    console.log("---------")
    console.log(result)
  })







  // console.time("initData")
  // // departments
  // let departmentIds: any = []
  // for (let i=0;i<1;i++) {
  //   const request = new sql.Request(db)
  //   request.input("departmentName", sql.VarChar, departments)

  //   let department: any = await request.query(`INSERT INTO abteilung VALUES ?`, [departments])
  //   departmentIds.push(department.recordset[0].id)
  // }
  // console.dir({deps:departmentIds})
  // console.log({deps:departmentIds})
  // console.log("hi")
  // console.timeEnd("initData")


  // phonetyps

  // locations
}

initData()

// return random item of array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// const locations = [
//   ["Berlin", "0302-1132"],
//   ["Hamburg", "040-45561"],
//   ["München", "0501-7856"],
//   ["Köln", "06412-3498"],
// ]

// const costunits = ["11111", "22222", "33333", "44444", "55555"]

// let locationIds: any[] = []

// for (let location of locations) {
//   let record: any = await pb.collection("standort").create({
//     bezeichnung: location[0],
//     vorwahl: location[1],
//   })
//   let data = { id: record.id, bezeichnung: location[0], vorwahl: location[1] }
//   locationIds.push(data)
// }

// function randomIntFromInterval(min: number, max: number) {
//   // min and max included
//   return Math.floor(Math.random() * (max - min + 1) + min)
// }



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
