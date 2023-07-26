import { faker } from "@faker-js/faker"
import commandLineArgs from "command-line-args"
import prisma from "../kontaktverzeichnis/src/lib/server/prisma.js"

const optionDefinitions = [
  { name: "verbose", alias: "v", type: Boolean },
  { name: "count", alias: "c", type: Number, defaultOption: true, defaultValue: 100 },
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
  let abteilungIds: number[] = []
  for (let abteilung of departments) {
    let res = await prisma.abteilung.create({ data: { bezeichnung: abteilung } })
    abteilungIds.push(res.id)
  }

  let eintragTypIds: number[] = []
  for (let eintragTyp of phonetyps) {
    let res = await prisma.eintragTyp.create({ data: { bezeichnung: eintragTyp } })
    eintragTypIds.push(res.id)
  }

  let standortIds: number[] = []
  for (let standort of locations) {
    let res = await prisma.standort.create({ data: { bezeichnung: standort[0], vorwahl: standort[1] } })
    standortIds.push(res.id)
  }

  return [abteilungIds, eintragTypIds, standortIds]
}

async function createRandomPhoneNummer(ranStandortIds: { id: number }[]) {
  const standort = faker.helpers.arrayElement(ranStandortIds.map((obj) => obj.id))
  const vorwahl = locations[standortIds.indexOf(standort)][1]
  const eintragTyp = faker.helpers.arrayElement(eintragTypIds)

  const telNumber = faker.phone.number(vorwahl + "-" + "#".repeat(randomIntFromInterval(1, 5)))
  let res = await prisma.telefonEintrag.create({
    data: {
      eintragTyp: { connect: { id: eintragTyp } },
      nummer: telNumber,
      standort: { connect: { id: standort } },
    },
  })

  return res.id
}

async function createRandomPerson() {
  let abteilungen = faker.helpers.arrayElements(abteilungIds, randomIntFromInterval(1, 4)).map((id) => ({ id }))
  let standorte = faker.helpers.arrayElements(standortIds, randomIntFromInterval(1, 3)).map((id) => ({ id }))

  //Telefonnummern
  let telNums = await runRandomTimes(1, 7, async () => {
    return await createRandomPhoneNummer(standorte)
  })

  //Person
  const vorname = faker.name.firstName()
  const nachname = faker.name.lastName()
  const personalnummer = randomIntFromInterval(1, 99999).toString()
  const kostenstelle = faker.helpers.arrayElement(costunits)
  const email = `${vorname}.${nachname}@firma.de`
  const titel =
    faker.helpers.maybe<string>(() => faker.helpers.arrayElement(["Dr.", "Prof.", "Dr. med.", "Prof. Dr."]), {
      probability: 0.1,
    }) || null

  await prisma.person.create({
    data: {
      vorname,
      nachname,
      personalnummer,
      kostenstelle,
      email,
      titel,
      abteilung: { connect: abteilungen },
      standort: { connect: standorte },
      telefonEintrag: { connect: telNums.map((id) => ({ id })) },
    },
  })
}

async function createRandomRessource() {
  let abteilungen = faker.helpers.arrayElements(abteilungIds, randomIntFromInterval(1, 4)).map((id) => ({ id }))
  let standorte = faker.helpers.arrayElements(standortIds, randomIntFromInterval(1, 3)).map((id) => ({ id }))

  //Telefonnummern
  let telNums = await runRandomTimes(1, 7, async () => {
    return await createRandomPhoneNummer(standorte)
  })

  //Ressource
  const bezeichnung = faker.random.word()
  const email = `${bezeichnung}@meinefirma.de`

  await prisma.ressource.create({
    data: {
      bezeichnung,
      email,
      abteilung: { connect: abteilungen },
      standort: { connect: standorte },
      telefonEintrag: { connect: telNums.map((id) => ({ id })) },
    },
  })
}

// Main
var [abteilungIds, eintragTypIds, standortIds]: [number[], number[], number[]] = [[], [], []]
async function main() {
  console.log("start")
  let res = await initData()
  abteilungIds = res[0]
  eintragTypIds = res[1]
  standortIds = res[2]

  // // random person
  let jobarr = []
  for (let i = 0; i < options.count; i++) {
    jobarr.push(createRandomPerson())
  }
  await Promise.all(jobarr)

  // // random ressource
  let ressourcejobarr = []
  for (let i = 0; i < options.count; i++) {
    ressourcejobarr.push(createRandomRessource())
  }
  await Promise.all(ressourcejobarr)

  console.log("done")
}

main()
