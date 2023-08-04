export default function parseEntities(persons: any[], ressources: any[]) {
  if (persons) {
    persons = persons.map((v: any) => ({
      ...v,
      name: { name: v.titel ? `${v?.titel + " "}${v.vorname} ${v.nachname}` : `${v.vorname} ${v.nachname}`, type: "person", id: v.id },
      kontakt: { telefonEintraege: v.telefonEintrag, email: v.email },
    }))
  }
  if (ressources) {
    ressources = ressources.map((v: any) => ({
      ...v,
      name: { name: v.bezeichnung, type: "ressource" },
      kontakt: { telefonEintraege: v.telefonEintrag, email: v.email, id: v.id },
    }))
  }

  return persons.concat(ressources)
}
