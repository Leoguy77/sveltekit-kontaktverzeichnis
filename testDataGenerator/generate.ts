import { faker } from "@faker-js/faker"
import sql from "mssql"
import commandLineArgs from "command-line-args"
import db from "../kontaktverzeichnis/src/lib/server/db.js"
import {
  bulkInsert,
  insertRow,
  insertJunction,
  SearchAll,
  searchAllPersons,
  SearchAllRessources,
  getDepartments,
  getDepartment,
} from "../kontaktverzeichnis/src/lib/server/dbFunctions.js"

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
  let abteilungIds = bulkInsert("abteilung", [["bezeichnung", false]], departments, db)

  let eintragTypIds = bulkInsert("eintragTyp", [["bezeichnung", false]], phonetyps, db)

  let standortIds = bulkInsert(
    "standort",
    [
      ["bezeichnung", false],
      ["vorwahl", true],
    ],
    locations,
    db
  )

  return await Promise.all([abteilungIds, eintragTypIds, standortIds])
}

async function createRandomPhoneNummer(
  ranStandortIds: number[],
  Id: number,
  transaction: sql.Transaction,
  type: "person" | "ressource"
) {
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

  if (type == "person") {
    await insertJunction("telefonEintragperson", ["telefonEintragID", "personID"], telefonEintragId, Id, transaction)
  } else if (type == "ressource") {
    await insertJunction("telefonEintragressource", ["telefonEintragID", "ressourceID"], telefonEintragId, Id, transaction)
  }
}

async function createRandomPerson() {
  let transaction = new sql.Transaction(db)
  await transaction.begin()
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
      await createRandomPhoneNummer(standorte, personId, transaction, "person")
    })

    await transaction.commit()
  } catch (err) {
    console.log(err)
    await transaction.rollback()
  }
}

async function createRandomRessource() {
  let transaction = new sql.Transaction(db)
  await transaction.begin()
  try {
    const bezeichnung = faker.random.word()
    let abteilungen = faker.helpers.arrayElements(abteilungIds, randomIntFromInterval(1, 4))
    const standort = await faker.helpers.arrayElement(standortIds)

    const email = `${bezeichnung}@meinefirma.de`

    const ressourceID = await insertRow("ressource", ["bezeichnung", "email"], [bezeichnung, email], transaction)

    //Abteilungen
    for (let abteilungId of abteilungen) {
      await insertJunction("ressourceabteilung", ["abteilungID", "ressourceID"], abteilungId, ressourceID, transaction)
    }

    //Standorte
    let standorte = faker.helpers.arrayElements(standortIds, randomIntFromInterval(1, 3))
    for (let standortId of standorte) {
      await insertJunction("standortressource", ["standortID", "ressourceID"], standortId, ressourceID, transaction)
    }

    //Telefonnummern
    await runRandomTimes(1, 5, async () => {
      await createRandomPhoneNummer(standorte, ressourceID, transaction, "ressource")
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
  let ressourcejobarr = []
  for (let i = 0; i < options.count; i++) {
    ressourcejobarr.push(createRandomRessource())
  }
  await Promise.all(ressourcejobarr)

  console.log("done")
  await db.close()
}

main()
