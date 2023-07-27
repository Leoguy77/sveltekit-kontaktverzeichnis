import { PrismaClient } from "@prisma/client"
//import { MEILI_MASTER_KEY } from "$env/static/private"
import { MeiliSearch } from "meilisearch"
const MeiliSearchClient = new MeiliSearch({
  host: "http://localhost:7700",
  //apiKey: MEILI_MASTER_KEY,
})
const meili = MeiliSearchClient.index("entities")

const prisma = new PrismaClient().$extends({
  query: {
    person: {
      async create({ operation, model, args, query }) {
        args.include = { standort: true, telefonEintrag: { include: { eintragTyp: true, standort: true } }, abteilung: true }
        let res = await query(args)
        let meilidoc = JSON.parse(JSON.stringify(res))
        meilidoc.id = `p_${res.id}`
        meili.addDocuments([meilidoc])
        return res
      },
      async update({ operation, model, args, query }) {
        args.include = { standort: true, telefonEintrag: { include: { eintragTyp: true, standort: true } }, abteilung: true }
        let res = await query(args)
        let meilidoc = JSON.parse(JSON.stringify(res))
        meilidoc.id = `p_${res.id}`
        meili.addDocuments([meilidoc])
        return res
      },
      async delete({ operation, model, args, query }) {
        let res = await query(args)
        meili.deleteDocument(`p_${res.id}`)
        return res
      },
    },
    ressource: {
      async create({ operation, model, args, query }) {
        args.include = { standort: true, telefonEintrag: { include: { eintragTyp: true, standort: true } }, abteilung: true }
        let res = await query(args)
        let meilidoc = JSON.parse(JSON.stringify(res))
        meilidoc.id = `r_${res.id}`
        meili.addDocuments([meilidoc])
        return res
      },
      async update({ operation, model, args, query }) {
        args.include = { standort: true, telefonEintrag: { include: { eintragTyp: true, standort: true } }, abteilung: true }
        let res = await query(args)
        let meilidoc = JSON.parse(JSON.stringify(res))
        meilidoc.id = `r_${res.id}`
        meili.addDocuments([meilidoc])
        return res
      },
      async delete({ operation, model, args, query }) {
        let res = await query(args)
        meili.deleteDocument(`r_${res.id}`)
        return res
      },
    },
    abteilung: {
      async update({ operation, model, args, query }) {
        args.include = {
          person: {
            include: { standort: true, telefonEintrag: { include: { eintragTyp: true, standort: true } }, abteilung: true },
          },
          ressource: {
            include: { standort: true, telefonEintrag: { include: { eintragTyp: true, standort: true } }, abteilung: true },
          },
        }
        let res = await query(args)

        if (res.person) {
          for (let person of res.person) {
            let meilidoc = JSON.parse(JSON.stringify(person))
            meilidoc.id = `p_${person.id}`
            meili.addDocuments([meilidoc])
          }
        }
        if (res.ressource) {
          for (let ressource of res.ressource) {
            let meilidoc = JSON.parse(JSON.stringify(ressource))
            meilidoc.id = `p_${ressource.id}`
            meili.addDocuments([meilidoc])
          }
        }
        return res
      },
    },
  },
})

export default prisma
