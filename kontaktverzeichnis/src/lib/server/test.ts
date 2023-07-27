import prisma from "./prisma.ts"

import { MeiliSearch } from "meilisearch"
const MeiliSearchClient = new MeiliSearch({
  host: "http://localhost:7700",
  //apiKey: MEILI_MASTER_KEY,
})
const meili = MeiliSearchClient.index("entities")
// meili.deleteAllDocuments()
// prisma.person.deleteMany()

// let tes = await prisma.person.create({
//   data: {
//     vorname: "boss2",
//     nachname: "zts",
//     standort: { connect: { id: 1 } },
//     abteilung: { connect: [{ id: 1 }, { id: 2 }] },
//     telefonEintrag: { connect: [{ id: 1 }, { id: 2 }] },
//   },
// })

// let test = await prisma.abteilung.update({ data: { bezeichnung: "Perso" }, where: { id: 1 } })

let person = await prisma.person.findUnique({
  where: { id: 3 },
  include: { telefonEintrag: { include: { eintragTyp: true, standort: true } } },
})
console.log(person)

if (person) {
  let neu = [
    {
      nummer: "111-45561-4",
      eintragTypId: 10,
      standortId: 10,
    },
  ]

  let alt = person.telefonEintrag.slice(0, 2)

  let newperson = await prisma.person.update({
    where: { id: person.id },
    data: {
      telefonEintrag: {
        deleteMany: {
          NOT: alt.map((num) => ({ id: num.id })),
        },
        create: neu,
      },
    },
    include: { telefonEintrag: { include: { eintragTyp: true, standort: true } } },
  })
  // let nums = { set: lol }
  // console.log(nums)
  // let newperson = await prisma.person.update({
  //   where: { id: person.id },
  //   data: { telefonEintrag: nums },
  //   include: { telefonEintrag: { include: { eintragTyp: true, standort: true } } },
  // })

  console.log(newperson)
}
