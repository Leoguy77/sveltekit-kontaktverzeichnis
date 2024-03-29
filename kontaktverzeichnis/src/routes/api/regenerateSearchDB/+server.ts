import type { RequestHandler } from "@sveltejs/kit"
import prisma from "$lib/server/prisma.ts"
import { meili, meiliIndex } from "$lib/server/prisma.ts"

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) {
    return new Response("Unauthorized", {
      status: 401,
    })
  }
  await meili.deleteIndex("entities")
  let JSONPerson: any = await prisma.$queryRaw`select (select person.id as id,
    vorname,
    nachname,
    email,
    titel,
    
    (
    select telefonEintrag.id,nummer,standortId,eintragTypId,
    (select standort.id, standort.bezeichnung from standort
     where standort.id=telefonEintrag.standortId
    for json path, WITHOUT_ARRAY_WRAPPER) as  standort,
    (select eintragTyp.id, eintragTyp.bezeichnung from eintragTyp where eintragTyp.id=eintragTypId for json path, WITHOUT_ARRAY_WRAPPER) as eintragTyp
    from telefonEintrag 
    
    where telefonEintrag.personId=person.id for json path
    
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
    ) as standort,
    (select
    bezeichnung,
    Tag
    from _funktionsBezeichnungToperson
    join funktionsBezeichnung ON funktionsBezeichnung.id = _funktionsBezeichnungToperson.A
    where _funktionsBezeichnungToperson.B=person.id for json path
    ) as funktionsBezeichnung
    
    from person 
    for json path) as result `

  let parsedPerson = []
  if (JSONPerson[0].result) {
    parsedPerson = JSON.parse(JSONPerson[0].result).map((obj: any) => {
      obj.id = `p_${obj.id}`
      if (obj.telefonEintrag) {
        obj.telefonEintrag = obj.telefonEintrag.map((telEintrag: any) => {
          telEintrag.standort = JSON.parse(telEintrag.standort)
          telEintrag.eintragTyp = JSON.parse(telEintrag.eintragTyp)
          return telEintrag
        })
      }
      return obj
    })
  }

  let JSONRessource: any = await prisma.$queryRaw`
    
    select (
select ressource.id as id,

  email,
  bezeichnung,

  
  (
  select telefonEintrag.id,nummer,standortId,eintragTypId,
  (select standort.id, standort.bezeichnung from standort
   where standort.id=telefonEintrag.standortId
  for json path, WITHOUT_ARRAY_WRAPPER) as  standort,
  (select eintragTyp.id, eintragTyp.bezeichnung from eintragTyp where eintragTyp.id=eintragTypId for json path, WITHOUT_ARRAY_WRAPPER) as eintragTyp
  from telefonEintrag 
  
  where telefonEintrag.ressourceId=ressource.id for json path
  
  ) as telefonEintrag,
  
  (select 
  id,
  bezeichnung
  from _abteilungToressource
  join abteilung on abteilung.id=_abteilungToressource.A
  where _abteilungToressource.B=ressource.id for json path
  ) as abteilung,
  
  (select 
  id,
  bezeichnung
  from _ressourceTostandort
  join standort on standort.id=_ressourceTostandort.B
  where _ressourceTostandort.A=ressource.id for json path
  ) as standort,
    (select
    bezeichnung,
    Tag
    from _funktionsBezeichnungToressource
    join funktionsBezeichnung ON funktionsBezeichnung.id = _funktionsBezeichnungToressource.A
    where _funktionsBezeichnungToressource.B=ressource.id for json path
    ) as funktionsBezeichnung
  
  from ressource 
  for json path
  ) as result`

  let parsedRessource = []
  if (JSONRessource[0].result) {
    parsedRessource = JSON.parse(JSONRessource[0].result).map((obj: any) => {
      obj.id = `r_${obj.id}`
      if (obj.telefonEintrag) {
        obj.telefonEintrag = obj.telefonEintrag.map((telEintrag: any) => {
          telEintrag.standort = JSON.parse(telEintrag.standort)
          telEintrag.eintragTyp = JSON.parse(telEintrag.eintragTyp)
          return telEintrag
        })
      }
      return obj
    })
  }

  await meili.createIndex("entities")
  let task = await meili.index("entities").updateSettings({
    searchableAttributes: [
      "bezeichnung",
      "nachname",
      "telefonEintrag",
      "abteilung",
      "vorname",
      "email",
      "titel",
      "standort",
      "funktionsBezeichnung.bezeichnung",
      "funktionsBezeichnung.Tag",
    ],
    typoTolerance: {
      enabled: true,
      minWordSizeForTypos: { oneTypo: 4, twoTypos: 6 },
      disableOnAttributes: ["id", "telefonEintrag"],
    },
    rankingRules: ["words", "typo", "attribute", "exactness"],
  })

  await meili.waitForTasks([task.taskUid])
  console.log(parsedRessource)
  await meili.index("entities").addDocuments([...parsedPerson, ...parsedRessource])

  return new Response("done")
}
