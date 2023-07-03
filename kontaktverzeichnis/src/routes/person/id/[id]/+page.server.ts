import db from "$lib/server/db.ts"
import pb from "$lib/server/db.ts"
import dbCache from "$lib/server/dbCache.ts"
import { getPerson } from "$lib/server/dbFunctions.ts"
import { createCommonData } from "$lib/server/entityParser.ts"

export const actions = {
  save: async ({ request, locals }: any) => {
    try {
      const body = Object.fromEntries(await request.formData())
      let data = JSON.parse(body.data)
      let submitData = {
        titel: data.titel,
        vorname: data.vorname,
        nachname: data.nachname,
        email: data.email,
      }
      let pb = locals.pb
      let person = pb.collection("person").update(data.id, submitData)
      let secureData = pb.collection("secureData").update(data.expand.secureData.id, data.expand.secureData)
      await Promise.all([person, secureData])
      return { success: true }
    } catch {
      return { error: "Internal Server Error" }
    }
  },

  delNumber: async ({ request, locals }: any) => {
    try {
      const body = Object.fromEntries(await request.formData())
      let id = body.data
      let pb = locals.pb
      await pb.collection("telefonEintrag").delete(id)
      return { success: true }
    } catch {
      return { error: "Internal Server Error" }
    }
  },

  addNumber: async ({ request, locals, params }: any) => {
    try {
      const body = Object.fromEntries(await request.formData())
      let pb = locals.pb

      const data = {
        eintragTyp: body.eintragTyp,
        nummer: body.number,
        standort: body.standort,
      }
      let telEintrag = pb.collection("telefonEintrag").create(data)
      let person = pb.collection("person").getOne(params.id)

      let res = await Promise.all([person, telEintrag])

      let telefonEintraege = res[0].telefonEintraege
      telefonEintraege.push(res[1].id)

      await pb.collection("person").update(params.id, { telefonEintraege: telefonEintraege })
      return { success: true }
    } catch {
      return { error: "Internal Server Error" }
    }
  },

  delDepartment: async ({ request, locals, params }: any) => {
    try {
      const body = Object.fromEntries(await request.formData())
      let pb = locals.pb
      let person = await pb.collection("person").getOne(params.id)
      let abteilungen = person.abteilungen
      abteilungen = abteilungen.filter((item: any) => item !== body.data)

      await pb.collection("person").update(params.id, { abteilungen: abteilungen })
      return { success: true }
    } catch {
      return { error: "Internal Server Error" }
    }
  },

  addDepartment: async ({ request, locals, params }: any) => {
    try {
      const body = Object.fromEntries(await request.formData())
      let pb = locals.pb
      let person = await pb.collection("person").getOne(params.id)
      let abteilungen = person.abteilungen
      abteilungen.push(body.abteilung)

      await pb.collection("person").update(params.id, { abteilungen: abteilungen })
      return { success: true }
    } catch {
      return { error: "Internal Server Error" }
    }
  },

  delCompany: async ({ request, locals, params }: any) => {
    try {
      const body = Object.fromEntries(await request.formData())
      let pb = locals.pb
      let person = await pb.collection("person").getOne(params.id)
      let standorte = person.standort
      standorte = standorte.filter((item: any) => item !== body.data)

      await pb.collection("person").update(params.id, { standort: standorte })
      return { success: true }
    } catch {
      return { error: "Internal Server Error" }
    }
  },

  addCompany: async ({ request, locals, params }: any) => {
    try {
      const body = Object.fromEntries(await request.formData())
      let pb = locals.pb
      let person = await pb.collection("person").getOne(params.id)
      let standorte = person.standort
      standorte.push(body.standort)

      await pb.collection("person").update(params.id, { standort: standorte })
      return { success: true }
    } catch {
      return { error: "Internal Server Error" }
    }
  },
}

export const load = async ({ locals, params }: any) => {
  let pocketbase = pb

  if (locals.pb.authStore.isValid) {
    pocketbase = locals.pb
  }

  let person: any
  person = await getPerson(db, params.id)
  person = person[0]
  let telefonEintraege = []

  const regex = /(\d+)\s\(([^)]+)\)/g

  let match
  while ((match = regex.exec(person.nummern)) !== null) {
    const id = match[1]
    const entryData = match[2]
    const entryParts = entryData.split(", ").map((part) => part.trim())
    const vorwahl = entryParts[0]
    const nummer = entryParts[1]
    const standort = entryParts[2]
    const einTragTyp = entryParts[3]
    telefonEintraege.push({ id, vorwahl, nummer, standort, einTragTyp })
  }

  let standorte = []
  if (person.standorte) {
    const regex = /(\d+)\s\(([^)]+)\)/g
    const entries = []

    let match
    while ((match = regex.exec(person.standorte)) !== null) {
      const id = match[1]
      const bezeichnung = match[2].trim()

      entries.push({ id, bezeichnung })
    }

    for (let standort of entries) {
      standorte.push({
        id: standort.id,
        bezeichnung: standort.bezeichnung,
      })
    }
  }
  standorte.sort((a: any, b: any) => {
    if (a.bezeichnung < b.bezeichnung) {
      return -1
    }
    if (a.bezeichnung > b.bezeichnung) {
      return 1
    }
    return 0
  })

  let abteilungen = []
  if (person.abteilungen) {
    const regex = /(\d+)\s\(([^)]+)\)/g
    const departmentPairs = []

    let match
    while ((match = regex.exec(person.abteilungen)) !== null) {
      const id = match[1]
      const bezeichnung = match[2]
      departmentPairs.push({ id, bezeichnung })
    }
    for (let abteilung of departmentPairs) {
      abteilungen.push({
        id: abteilung.id,
        bezeichnung: abteilung.bezeichnung,
      })
    }
  }
  abteilungen.sort((a: any, b: any) => {
    if (a.bezeichnung < b.bezeichnung) {
      return -1
    }
    if (a.bezeichnung > b.bezeichnung) {
      return 1
    }
    return 0
  })

  person.telefonEintraege = telefonEintraege
  person.standorte = standorte
  person.abteilungen = abteilungen

  return { person }
}
