import { PrismaClient } from "@prisma/client"
import { MEILI_MASTER_KEY } from "$env/static/private"
import { MeiliSearch } from "meilisearch"
import { prismaInclude } from "../shared/prismaTypes.ts"
export const meili = new MeiliSearch({
  host: "http://meilisearch:7700",
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
        delete meilidoc.kostenstelle
        delete meilidoc.personalnummer
        meiliIndex.addDocuments([meilidoc])
        return res
      },
      async update({ operation, model, args, query }) {
        args.include = prismaInclude
        let res = await query(args)
        let meilidoc: any = structuredClone(res)
        meilidoc.id = `p_${res.id}`
        delete meilidoc.kostenstelle
        delete meilidoc.personalnummer
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
