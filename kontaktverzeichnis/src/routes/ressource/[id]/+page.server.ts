import dbCache from "$lib/server/dbCache.ts"
import pb from "$lib/server/db.ts"
import { get } from "http"
import { getRessource } from "$lib/server/dbFunctions.ts"
import db from "$lib/server/db.ts"

export const actions = {
  save: async ({ request, locals }: any) => {
    try {
      const body = Object.fromEntries(await request.formData())
      let data = JSON.parse(body.data)
      let submitData = {
        bezeichner: data.bezeichner,
        email: data.email,
      }
      let pb = locals.pb
      let ressource = await pb.collection("ressource").update(data.id, submitData)
      dbCache.refreshCache()
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
      dbCache.refreshCache()
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
      let ressource = pb.collection("ressource").getOne(params.id)

      let res = await Promise.all([ressource, telEintrag])

      let telefonEintraege = res[0].telefonEintraege
      telefonEintraege.push(res[1].id)

      await pb.collection("ressource").update(params.id, { telefonEintraege: telefonEintraege })
      dbCache.refreshCache()
      return { success: true }
    } catch {
      return { error: "Internal Server Error" }
    }
  },

  delDepartment: async ({ request, locals, params }: any) => {
    try {
      const body = Object.fromEntries(await request.formData())
      let pb = locals.pb
      let ressource = await pb.collection("ressource").getOne(params.id)
      let abteilungen = ressource.abteilungen
      abteilungen = abteilungen.filter((item: any) => item !== body.data)

      await pb.collection("ressource").update(params.id, { abteilungen: abteilungen })
      dbCache.refreshCache()
      return { success: true }
    } catch {
      return { error: "Internal Server Error" }
    }
  },

  addDepartment: async ({ request, locals, params }: any) => {
    try {
      const body = Object.fromEntries(await request.formData())
      let pb = locals.pb
      let ressource = await pb.collection("ressource").getOne(params.id)
      let abteilungen = ressource.abteilungen
      abteilungen.push(body.abteilung)

      await pb.collection("ressource").update(params.id, { abteilungen: abteilungen })
      dbCache.refreshCache()
      return { success: true }
    } catch {
      return { error: "Internal Server Error" }
    }
  },

  delCompany: async ({ request, locals, params }: any) => {
    try {
      const body = Object.fromEntries(await request.formData())
      let pb = locals.pb
      let ressource = await pb.collection("ressource").getOne(params.id)
      let standorte = ressource.standort
      standorte = standorte.filter((item: any) => item !== body.data)

      await pb.collection("ressource").update(params.id, { standort: standorte })
      dbCache.refreshCache()
      return { success: true }
    } catch {
      return { error: "Internal Server Error" }
    }
  },

  addCompany: async ({ request, locals, params }: any) => {
    try {
      const body = Object.fromEntries(await request.formData())
      let pb = locals.pb
      let ressource = await pb.collection("ressource").getOne(params.id)
      let standorte = ressource.standort
      standorte.push(body.standort)

      await pb.collection("ressource").update(params.id, { standort: standorte })
      dbCache.refreshCache()
      return { success: true }
    } catch {
      return { error: "Internal Server Error" }
    }
  },
}

export const load = async ({ locals, params }: any) => {
  let ressource: any
  ressource = await getRessource(db, params.id)
  ressource = ressource[0]

  let telefonEintraege = []

  const regex = /(\d+)\s\(([^)]+)\)/g

  let match
  while ((match = regex.exec(ressource.nummern)) !== null) {
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
  if (ressource.standorte) {
    const regex = /(\d+)\s\(([^)]+)\)/g
    const entries = []

    let match
    while ((match = regex.exec(ressource.standorte)) !== null) {
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
  if (ressource.abteilungen) {
    const regex = /(\d+)\s\(([^)]+)\)/g
    const departmentPairs = []

    let match
    while ((match = regex.exec(ressource.abteilungen)) !== null) {
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

  ressource.telefonEintraege = telefonEintraege
  ressource.standorte = standorte
  ressource.abteilungen = abteilungen
  return { ressource }
}
