import { PrismaClient } from "../../kontaktverzeichnis/node_modules/@prisma/client/index.js"
import { MeiliSearch } from "meilisearch"

const MEILI_MASTER_KEY = process.env.MEILI_MASTER_KEY
const prismaInclude = { standort: true, telefonEintrag: { include: { eintragTyp: true, standort: true } }, abteilung: true }
export const meili = new MeiliSearch({
  host: "http://localhost:7700",
  apiKey: MEILI_MASTER_KEY,
})
export const meiliIndex = meili.index("entities")

const prisma = new PrismaClient().$extends({
  query: {
    person: {
      async create({ operation, model, args, query }) {
        args.include = prismaInclude
        let res = await query(args)
        let meilidoc: any = structuredClone(res)
        meilidoc.id = `p_${res.id}`
        meilidoc.kostenstelle = null
        meilidoc.personalnummer = null
        meiliIndex.addDocuments([meilidoc])
        return res
      },
      async update({ operation, model, args, query }) {
        args.include = prismaInclude
        let res = await query(args)
        let meilidoc: any = structuredClone(res)
        meilidoc.id = `p_${res.id}`
        meilidoc.kostenstelle = null
        meilidoc.personalnummer = null
        meiliIndex.addDocuments([meilidoc])
        return res
      },
      async delete({ operation, model, args, query }) {
        let res = await query(args)
        meiliIndex.deleteDocument(`p_${res.id}`)
        return res
      },
    },
    ressource: {
      async create({ operation, model, args, query }) {
        args.include = prismaInclude
        let res = await query(args)
        let meilidoc: any = structuredClone(res)
        meilidoc.id = `r_${res.id}`
        meiliIndex.addDocuments([meilidoc])
        return res
      },
      async update({ operation, model, args, query }) {
        args.include = prismaInclude
        let res = await query(args)
        let meilidoc: any = structuredClone(res)
        meilidoc.id = `r_${res.id}`
        meiliIndex.addDocuments([meilidoc])
        return res
      },
      async delete({ operation, model, args, query }) {
        let res = await query(args)
        meiliIndex.deleteDocument(`r_${res.id}`)
        return res
      },
    },
    abteilung: {
      async update({ operation, model, args, query }) {
        args.include = {
          person: {
            include: prismaInclude,
          },
          ressource: {
            include: prismaInclude,
          },
        }
        let res = await query(args)
        let meilidocs: any = []
        if (res.person) {
          for (let person of res.person) {
            let meilidoc = JSON.parse(JSON.stringify(person))
            meilidoc.id = `p_${person.id}`
            meilidocs.push(meilidoc)
          }
        }
        if (res.ressource) {
          for (let ressource of res.ressource) {
            let meilidoc = JSON.parse(JSON.stringify(ressource))
            meilidoc.id = `p_${ressource.id}`
            meilidocs.push(meilidoc)
          }
        }
        meiliIndex.addDocuments(meilidocs)
        return res
      },
    },
  },
})

await prisma.$connect()
export default prisma
