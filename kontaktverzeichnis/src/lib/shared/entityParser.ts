export default function parseEntities(persons: any[], ressources: any[]) {
  if (persons) {
    persons = persons.map((v: any) => ({
      ...v,
      id: `p_${v.id}`,
      name: { name: v.titel ? `${v?.titel + " "}${v.vorname} ${v.nachname}` : `${v.vorname} ${v.nachname}`, type: "person", id: v.id },
      kontakt: { telefonEintraege: v.telefonEintrag, email: v.email },
    }))
  }
  if (ressources) {
    ressources = ressources.map((v: any) => ({
      ...v,
      id: `r_${v.id}`,
      name: { name: v.bezeichnung, type: "ressource", id: v.id },
      kontakt: { telefonEintraege: v.telefonEintrag, email: v.email, id: v.id },
    }))
  }

  return persons.concat(ressources)
}
