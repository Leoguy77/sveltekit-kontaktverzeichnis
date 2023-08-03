// import { createCommonData } from "$lib/server/entityParser.ts"
import type { PageLoad } from "./$types.ts"

export const load: PageLoad = async ({ params, fetch }) => {
  if (params.id === "new") {
    return { ressource: { telefonEintrag: [], abteilung: [], standort: [] } }
  }
  let res = await fetch("/api/ressource/" + params.id)
  let ressource = await res.json()
  console.log(ressource)
  return { ressource: ressource }
}
