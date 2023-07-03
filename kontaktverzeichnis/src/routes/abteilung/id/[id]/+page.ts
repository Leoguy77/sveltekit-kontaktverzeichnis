export const load = async ({ params, fetch }: any) => {
  let entities = await fetch(`/api/abteilung/${params.id}`).then((res: any) => res.json())
  let department = { bezeichnung: "" }
  department.bezeichnung = entities[0].bezeichnung
  return { entities, department }
}
