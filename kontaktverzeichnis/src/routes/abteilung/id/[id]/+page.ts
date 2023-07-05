export const load = async ({ params, fetch }: any) => {
  let res = await fetch(`/api/abteilung/${params.id}`).then((res: any) => res.json())
  let entities = res.entities
  let department = res.department
  return { entities, department }
}
