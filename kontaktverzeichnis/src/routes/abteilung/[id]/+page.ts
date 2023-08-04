import entityParser from "$lib/shared/entityParser.ts"

export const load = async ({ params, fetch }: any) => {
  let res = await fetch(`/api/abteilung/${params.id}`).then((res: any) => res.json())
  let entities = entityParser(res.person, res.ressource)
  let department = res
  return { entities, department }
}
