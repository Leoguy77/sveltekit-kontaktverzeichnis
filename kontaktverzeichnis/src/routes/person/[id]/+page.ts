// import { createCommonData } from "$lib/server/entityParser.ts"
import type { PageLoad } from "./$types.ts"

export const load: PageLoad = async ({ params, fetch }) => {
  let res = await fetch("/api/person/" + params.id)
  let person = await res.json()
  return { person: person }
}
