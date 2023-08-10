import type { PageLoad } from "./$types.ts"
import { error } from "@sveltejs/kit"

export const load: PageLoad = async ({ params, fetch }) => {
  if (params.id === "new") {
    return { ressource: { telefonEintrag: [], abteilung: [], standort: [] } }
  }
  let res = await fetch("/api/ressource/" + params.id)
  if (res.status === 404) {
    throw error(404, {
      message: "Not found",
    })
  }
  let ressource = await res.json()
  return { ressource: ressource }
}
