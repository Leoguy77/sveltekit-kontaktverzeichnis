import { error, redirect } from "@sveltejs/kit"
import { getDotEnv } from "$lib/scripts/pb.js"
import PocketBase from "pocketbase"

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
      let ressource = pb.collection("ressource").getOne(params.id)

      let res = await Promise.all([ressource, telEintrag])

      let telefonEintraege = res[0].telefonEintraege
      telefonEintraege.push(res[1].id)

      await pb.collection("ressource").update(params.id, { telefonEintraege: telefonEintraege })

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

      return { success: true }
    } catch {
      return { error: "Internal Server Error" }
    }
  },
}

export const load = async ({ locals, params }: any) => {
  let pb: any

  if (!locals.pb.authStore.isValid) {
    let env: any
    env = getDotEnv()
    pb = new PocketBase("http://127.0.0.1:8090")
    await pb.collection("ressource").authWithPassword(env.parsed.APIUser, env.parsed.APIPW)
  } else {
    pb = locals.pb
  }

  let ressource: any
  ressource = await pb.collection("ressource").getOne(params.id, {
    expand: "standort,abteilungen,telefonEintraege,telefonEintraege.eintragTyp,telefonEintraege.standort",
  })
  ressource = structuredClone(ressource)

  return { ressource }
}
