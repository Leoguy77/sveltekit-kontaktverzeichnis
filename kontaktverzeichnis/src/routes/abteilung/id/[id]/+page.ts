export const load = async ({ params, fetch }: any) => {
  let [entities, department] = await Promise.all([
    (async () => {
      const response = await fetch(`/api/abteilung/${params.id}`)
      return await response.json()
    })(),
    (async () => {
      const response = await fetch("/api/abteilung")
      let departments = await response.json()
      return departments.find((department: any) => department.id === params.id)
    })(),
  ])

  return { entities, department }
}
