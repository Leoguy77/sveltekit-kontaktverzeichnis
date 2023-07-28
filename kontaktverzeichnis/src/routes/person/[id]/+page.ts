// import { createCommonData } from "$lib/server/entityParser.ts"
import type { PageLoad } from "./$types.ts"

export const load: PageLoad = async ({ params, fetch }) => {
  let person = fetch("/api/person/" + params.id)
  console.log("person", await person)
  return person
}
