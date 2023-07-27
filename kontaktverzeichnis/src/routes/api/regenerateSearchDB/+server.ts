import type { RequestHandler } from "@sveltejs/kit"
import prisma from "$lib/server/prisma.ts"
import { meili, meiliIndex } from "$lib/server/prisma.ts"

export const GET: RequestHandler = async (event) => {
  await meili.deleteIndex("entities")
  let JSONPerson: any = await prisma.$queryRaw`select (select person.id as id,
  vorname,
  nachname,
  personalnummer,
  kostenstelle,
  email,
  titel,
  
  (
  select telefonEintrag.id,nummer,standortId,eintragTypId,
  (select standort.id, standort.bezeichnung from standort
   where standort.id=telefonEintrag.standortId
  for json path, WITHOUT_ARRAY_WRAPPER) as  standort,
  (select eintragTyp.id, eintragTyp.bezeichnung from eintragTyp where eintragTyp.id=eintragTypId for json path, WITHOUT_ARRAY_WRAPPER) as eintragTyp
  from telefonEintrag 
  
  join _personTotelefonEintrag on _personTotelefonEintrag.B=telefonEintrag.id
  
  where _personTotelefonEintrag.A=person.id for json path
  
  ) as telefonEintrag,
  
  (select 
  id,
  bezeichnung
  from _abteilungToperson
  join abteilung on abteilung.id=_abteilungToperson.A
  where _abteilungToperson.B=person.id for json path
  ) as abteilung,
  
  (select 
  id,
  bezeichnung
  from _personTostandort
  join standort on standort.id=_personTostandort.B
  where _personTostandort.A=person.id for json path
  ) as standort
  
  from person 
  for json path) as result `

  let personParse = JSON.parse(JSONPerson[0].result).map((obj: any) => {
    obj.id = `p_${obj.id}`
    obj.telefonEintrag = obj.telefonEintrag.map((telEintrag: any) => {
      telEintrag.standort = JSON.parse(telEintrag.standort)
      telEintrag.eintragTyp = JSON.parse(telEintrag.eintragTyp)
      return telEintrag
    })
    return obj
  })

  console.log(personParse.length)
  await meili.index("entities").addDocuments(personParse)

  // if (JSONPerson) {
  //   // console.log(JSON.stringify(personParse, null, 2))
  // }

  // let [personen, ressourcen] = await Promise.all([
  //   prisma.person.findFirst({
  //     include: { standort: true, telefonEintrag: { include: { eintragTyp: true, standort: true } }, abteilung: true },
  //   }),
  //   prisma.ressource.findFirst({
  //     include: { standort: true, telefonEintrag: { include: { eintragTyp: true, standort: true } }, abteilung: true },
  //   }),
  // ])
  // // console.log(personen)
  // // console.log(personen?.standort)
  // console.log(ressourcen?.telefonEintrag)
  // personen = personen.map((p: any) => {
  //   p.id = `p_${p.id}`
  //   return p
  // })
  // ressourcen = ressourcen.map((r: any) => {
  //   r.id = `r_${r.id}`
  //   return r
  // })
  // await meili.index("entities").addDocuments([...personen, ...ressourcen])

  return new Response("done")
}
