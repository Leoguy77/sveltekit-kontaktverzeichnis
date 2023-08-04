export const load = async ({ params, fetch }: any) => {
  let res = await fetch(`/api/abteilung/${params.id}`).then((res: any) => res.json())
  res.person = res.person.map((v: any) => ({
    ...v,
    name: { name: v.titel ? `${v?.titel + " "}${v.vorname} ${v.nachname}` : `${v.vorname} ${v.nachname}`, type: "person", id: v.id },
    kontakt: { telefonEintraege: v.telefonEintrag, email: v.email },
  }))
  res.ressource = res.ressource.map((v: any) => ({
    ...v,
    name: { name: v.bezeichnung, type: "ressource" },
    kontakt: { telefonEintraege: v.telefonEintrag, email: v.email, id: v.id },
  }))

  let entities = res.person.concat(res.ressource)
  let department = res
  return { entities, department }
}
