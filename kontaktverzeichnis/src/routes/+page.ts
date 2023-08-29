import entityParser from "$lib/shared/entityParser.ts"
import type { PageLoad } from "./$types.ts"
import { PUBLIC_MEILI_SEARCH_KEY } from "$env/static/public"
import { browser } from "$app/environment"
import { PUBLIC_NODE_ENV } from "$env/static/public"

let publicUrl =
  PUBLIC_NODE_ENV === "dev"
    ? "http://localhost:7700/indexes/entities/search/"
    : "https://kontaktverzeichnis.gnh.net/indexes/entities/search/"

let searchUrl = browser ? publicUrl : "http://meilisearch:7700/indexes/entities/search/"

export const load: PageLoad = async (event) => {
  let searchText = event.url.searchParams.get("q")
  if (searchText) {
    searchText = searchText.replace(/[/?=]|\s\s/g, "")
    const response = await event.fetch(searchUrl, {
      method: "POST",
      body: JSON.stringify({ q: searchText, limit: 50 }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PUBLIC_MEILI_SEARCH_KEY}`,
      },
    })

    let res = await response.json()
    let persons: any = []
    let ressources: any = []
    let order = 0
    res.hits.forEach((obj: any) => {
      order++
      obj.order = order
      let type = obj.id[0]
      obj.id = obj.id.slice(2)
      if (type === "p") {
        obj.type = "person"
        persons.push(obj)
      } else if (type === "r") {
        obj.type = "ressource"
        ressources.push(obj)
      }
    })

    let searchResult = entityParser(persons, ressources)

    searchResult.sort((a, b) => {
      if (a.order < b.order) return -1
      if (a.order > b.order) return 1
      return 0
    })

    return {
      searchResult: searchResult,
    }
  } else {
    const res = await event.fetch("api/homePageEntrys")
    const entrys = await res.json()
    let searchResult = entityParser(entrys[0], entrys[1])
    console.log(searchResult[0])
    return {
      searchResult: searchResult,
    }
  }
}
