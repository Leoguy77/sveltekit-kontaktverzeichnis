import { abteilung, standort, eintragTyp } from "./lib.ts"
import { parse } from "csv-parse/sync"
import prisma from "./prisma.ts"
import fs from "fs"

let persons = parse(fs.readFileSync("./Personen.csv", "utf-8"), {
  delimiter: ";",
  columns: true,
  skip_empty_lines: true,
})

// create abteilungen
for (let person of persons) {
  if (person.Abteilung) {
    await abteilung.get(person.Abteilung)
  }
}

// create persons
let personsToCreate: {
  [key: string]: {
    vorname: string
    nachname: string
    personalnummer?: string
    kostenstelle?: string
    email: string
    titel?: string
    abteilung: number
    standort: number
    telefonEintrag: {
      nummer: string
      standortId: number
      eintragTypId: number
    }[]
  }
} = {}

for (let person of persons) {
  let pkey = `${person.Nachname},${person.Vorname},${person.Personalnummer}`
  if (personsToCreate[pkey]) {
    //TODO:standort + abteilung fehlen noch
    personsToCreate[pkey].telefonEintrag.push({
      nummer: person.Telefonnummer,
      standortId: await standort.get(person.Standort),
      eintragTypId: await eintragTyp.get(person.Typ),
    })
    continue
  } else {
    if (person.standort === "ka") {
      person.abteilung = ""
    }
    let personToCreate = {
      vorname: person.Vorname,
      nachname: person.Nachname,
      personalnummer: person?.Personalnummer,
      kostenstelle: person?.Kostenstelle,
      email: person.EmailAddress,
      titel: person?.Titel,
      abteilung: await abteilung.get(person.Abteilung),
      standort: await standort.get(person.Standort),
      telefonEintrag: [
        {
          nummer: person.Telefonnummer,
          standortId: await standort.get(person.Standort),
          eintragTypId: await eintragTyp.get(person.Typ),
        },
      ],
    }

    personsToCreate[pkey] = personToCreate
  }
}

for (let person of Object.values(personsToCreate)) {
  await prisma.person.create({
    data: {
      vorname: person.vorname,
      nachname: person.nachname,
      personalnummer: person.personalnummer,
      kostenstelle: person.kostenstelle,
      email: person.email,
      titel: person.titel,
      abteilung: {
        connect: {
          id: person.abteilung,
        },
      },
      standort: {
        connect: {
          id: person.standort,
        },
      },
      telefonEintrag: {
        create: person.telefonEintrag,
      },
    },
  })
  console.log(person.vorname, person.nachname)
}
