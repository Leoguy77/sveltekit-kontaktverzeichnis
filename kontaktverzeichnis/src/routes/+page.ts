export async function load(event: any) {
  console.log("load function triggered")
  if (event.url.searchParams.get("selectedSearch") === "1") {
    const response = await event.fetch("/api/abteilung")
    let departments = await response.json()
    departments = departments.map((department: any) => {
      return {
        id: department.id,
        name: department.bezeichnung,
        mitarbeiter: department.count,
      }
    })
    return {
      departments,
      user: event.data?.user,
    }
  } else {
    let searchText = event.url.searchParams.get("search")
    if (searchText) {
      searchText = searchText.replace(/[/?=]|\s\s/g, "")
      const response = await event.fetch(`/api/search/${searchText}`)
      const searchResult = await response.json()
      return {
        searchResult,
        user: event.data?.user,
      }
    } else {
      return {}
    }
  }
}
