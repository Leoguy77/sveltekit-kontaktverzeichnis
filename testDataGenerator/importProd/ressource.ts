import { abteilung, standort, eintragTyp } from "./lib.ts"
import { parse } from "csv-parse/sync"
import prisma from "./prisma.ts"
import fs from "fs"

let ressources = parse(fs.readFileSync("./Ressourcen.csv", "utf-8"), {
  delimiter: ";",
  columns: true,
  skip_empty_lines: true,
})

// create ressource
let ressourcesToCreate: {
  [key: string]: {
    bezeichnung: string
    abteilung: number[]
    standort: number[]
    telefonEintrag: {
      nummer: string
      standortId: number
      eintragTypId: number
    }[]
  }
} = {}

for (let ressource of ressources) {
  let pkey = `${ressource.Bezeichnung}`
  // console.log(ressource)
  if (ressourcesToCreate[pkey]) {
    ressourcesToCreate[pkey].telefonEintrag.push({
      nummer: ressource.Telefonnummer,
      standortId: await standort.get(ressource.Standort),
      eintragTypId: await eintragTyp.get(ressource.Typ),
    })
    ressourcesToCreate[pkey].abteilung.push(await abteilung.get(ressource.Abteilung))
    ressourcesToCreate[pkey].standort.push(await standort.get(ressource.standort))
    continue
  } else {
    if (ressource.standort === "ka") {
      ressource.abteilung = ""
    }
    let ressourceToCreate = {
      bezeichnung: ressource.Bezeichnung,
      abteilung: [await abteilung.get(ressource.Abteilung)],
      standort: [await standort.get(ressource.Standort)],
      telefonEintrag: [
        {
          nummer: ressource.Telefonnummer,
          standortId: await standort.get(ressource.Standort),
          eintragTypId: await eintragTyp.get(ressource.Typ),
        },
      ],
    }

    ressourcesToCreate[pkey] = ressourceToCreate
  }
}

for (let ressource of Object.values(ressourcesToCreate)) {
  const abteilungIds = ressource.abteilung.map((abteilung) => {
    return { id: abteilung }
  })
  const standortIds = ressource.standort.map((standort) => {
    return { id: standort }
  })
  await prisma.ressource.create({
    data: {
      bezeichnung: ressource.bezeichnung,
      abteilung: {
        connect: abteilungIds,
      },
      standort: {
        connect: standortIds,
      },
      telefonEintrag: {
        create: ressource.telefonEintrag,
      },
    },
  })
}
