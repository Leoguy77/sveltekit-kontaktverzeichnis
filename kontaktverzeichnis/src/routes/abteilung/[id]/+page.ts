import entityParser from "$lib/shared/entityParser.ts"

export const load = async ({ params, fetch }: any) => {
  let res = await fetch(`/api/abteilung/${params.id}`).then((res: any) => res.json())
  let entities = entityParser(res.person, res.ressource)
  entities.sort((a: any, b: any) => {
    const lowestAOrder = Math.min(...a.funktionsBezeichnung.map((f: any) => f.order))
    const lowestBOrder = Math.min(...b.funktionsBezeichnung.map((f: any) => f.order))

    if (lowestAOrder < lowestBOrder) return -1
    if (lowestAOrder > lowestBOrder) return 1
    return 0
  })
  let department = res
  return { entities, department }
}
