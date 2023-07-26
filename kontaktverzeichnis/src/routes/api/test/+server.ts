import prisma from "$lib/server/prisma.ts"
import type { RequestHandler } from "@sveltejs/kit"
import type { person } from "@prisma/client"
import { MeiliSearch } from "meilisearch"
import { MEILI_MASTER_KEY } from "$env/static/private"

const MeiliSearchClient = new MeiliSearch({
  host: "http://localhost:7700",
  apiKey: MEILI_MASTER_KEY,
})
const personIndex = MeiliSearchClient.index("person")

export const GET: RequestHandler = async (all) => {
  //   let test = await prisma.abteilung.findUnique({ where: { id: 1 }, include: { person: true } })
  //   if (test?.person) {
  //     let persons: person[] = test.person
  //     console.log(persons)
  //   }
  //   console.log(test)

  let person = await prisma.person.findMany()
  if (person) {
    console.log(person)
    addPersonsToMeilisearch(person)
  }
  return new Response('{"message":""}', {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

async function addPersonToMeilisearch(person: person) {
  let response = await personIndex.addDocuments([person])
  console.log(response)
}
async function addPersonsToMeilisearch(persons: person[]) {
  let response = await personIndex.addDocuments(persons)
  console.log(response)
}
