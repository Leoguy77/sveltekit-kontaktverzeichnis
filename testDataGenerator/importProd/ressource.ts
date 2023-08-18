import { abteilung, standort, eintragTyp } from "./lib.ts"
import { parse } from "csv-parse/sync"
import prisma from "./prisma.ts"
import fs from "fs"

let ressources = parse(fs.readFileSync("./Ressourcen.csv", "utf-8"), {
  delimiter: ";",
  columns: true,
  skip_empty_lines: true,
})
console.log(ressources)

// create abteilungen
for (let ressource of ressources) {
  if (ressource.Bezeichnung) {
    await abteilung.get(ressource.Bezeichnung)
  }
}

// create persons
let ressourcesToCreate: {
  [key: string]: {
    bezeichnung: string
    email: string
    abteilung: number
    standort: number
    telefonEintrag: {
      nummer: string
      standortId: number
      eintragTypId: number
    }[]
  }
} = {}

for (let ressource of ressources) {
  let pkey = `${ressource.bezeichnung}`
  if (ressourcesToCreate[pkey]) {
    ressourcesToCreate[pkey].telefonEintrag.push({
      nummer: ressource.Telefonnummer,
      standortId: await standort.get(ressource.Standort),
      eintragTypId: await eintragTyp.get(ressource.Typ),
    })
    continue
  } else {
    if (ressource.standort === "ka") {
      ressource.abteilung = ""
    }
    let personToCreate = {
      bezeichnung: ressource.Bezeichnung,
      email: ressource.EmailAddress,
      abteilung: await abteilung.get(ressource.Bezeichnung),
      standort: await standort.get(ressource.Standort),
      telefonEintrag: [
        {
          nummer: ressource.Telefonnummer,
          standortId: await standort.get(ressource.Standort),
          eintragTypId: await eintragTyp.get(ressource.Typ),
        },
      ],
    }

    ressourcesToCreate[pkey] = personToCreate
  }
}

for (let ressource of Object.values(ressourcesToCreate)) {
  //   await prisma.ressource.create({
  //     data: {
  //       bezeichnung: ressource.bezeichnung,
  //       email: ressource.email,
  //       abteilung: {
  //         connect: {
  //           id: ressource.abteilung,
  //         },
  //       },
  //       standort: {
  //         connect: {
  //           id: ressource.standort,
  //         },
  //       },
  //       telefonEintrag: {
  //         create: ressource.telefonEintrag,
  //       },
  //     },
  //   })
  console.log(ressource)
}
