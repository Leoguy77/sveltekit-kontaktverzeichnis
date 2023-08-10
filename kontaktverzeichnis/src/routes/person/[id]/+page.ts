import type { PageLoad } from "./$types.ts"
import { error } from "@sveltejs/kit"

export const load: PageLoad = async ({ params, fetch }) => {
  if (params.id === "new") {
    return { person: { telefonEintrag: [], abteilung: [], standort: [] } }
  }
  let res = await fetch("/api/person/" + params.id)
  if (res.status === 404) {
    throw error(404, {
      message: "Not found",
    })
  }
  let person = await res.json()
  return { person: person }
}
