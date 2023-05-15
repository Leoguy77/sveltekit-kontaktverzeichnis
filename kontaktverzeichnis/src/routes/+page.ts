export async function load({ fetch, url }: any) {
  let searchText = url.searchParams.get("search")
  if (searchText) {
    searchText = searchText.replace(/[/?=]|\s\s/g, "")
    const response = await fetch(`/api/search/${searchText}`)
    const searchResult = await response.json()
    console.log(searchResult)
    return {
      searchResult,
    }
  } else {
    return {}
  }
}
