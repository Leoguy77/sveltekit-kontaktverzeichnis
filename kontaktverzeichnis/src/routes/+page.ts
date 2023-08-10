import entityParser from "$lib/shared/entityParser.ts"
import type { PageLoad } from "./$types.ts"

export const load: PageLoad = async (event) => {
  console.log("search load function triggered")
  let searchText = event.url.searchParams.get("q")
  if (searchText) {
    searchText = searchText.replace(/[/?=]|\s\s/g, "")
    const response = await event.fetch(`http://localhost:7700/indexes/entities/search/`, {
      method: "POST",
      body: JSON.stringify({ q: searchText, limit: 50 }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    let res = await response.json()
    let persons: any = []
    let ressources: any = []
    res.hits.forEach((obj: any) => {
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

    return {
      searchResult: searchResult,
    }
  } else {
    return {}
  }
}
