export const load = async ({ params, fetch }: any) => {
  let entities = []
  const response = await fetch(`/api/abteilung/${params.id}`)
  entities = await response.json()
  return { entities }
}
