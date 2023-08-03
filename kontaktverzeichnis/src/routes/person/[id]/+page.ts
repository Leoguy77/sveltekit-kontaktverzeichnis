// import { createCommonData } from "$lib/server/entityParser.ts"
import type { PageLoad } from "./$types.ts"

export const load: PageLoad = async ({ params, fetch }) => {
  if (params.id === "new") {
    return { person: { telefonEintrag: [], abteilung: [], standort: [] } }
  }
  let res = await fetch("/api/person/" + params.id)
  let person = await res.json()
  return { person: person }
}
