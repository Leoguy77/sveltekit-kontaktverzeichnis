import entityParser from "$lib/shared/entityParser.ts"

export async function load(event: any) {
  if (event.url.searchParams.get("selectedSearch") === "1") {
    console.log("department load function triggered")
    const response = await event.fetch("/api/abteilung")
    let departments = await response.json()
    departments = departments.map((department: any) => {
      return {
        id: department.id,
        name: department.bezeichnung,
        mitarbeiter: department._count.person + department._count.ressource,
      }
    })
    return {
      departments,
    }
  } else {
    console.log("search load function triggered")
    let searchText = event.url.searchParams.get("search")
    if (searchText) {
      searchText = searchText.replace(/[/?=]|\s\s/g, "")
      const response = await event.fetch(`http://localhost:7700/indexes/entities/search/`, {
        method: "POST",
        body: JSON.stringify({ q: searchText }),
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
}
