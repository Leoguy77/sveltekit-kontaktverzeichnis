import { error, redirect } from '@sveltejs/kit'
import {getDotEnv} from '$lib/scripts/pb.js'
import PocketBase from 'pocketbase'

export const actions = {
	savePerson: async ({ request,locals }:any) => {
    try{
      const body = Object.fromEntries(await request.formData())
      let data=JSON.parse(body.data)
      let submitData={
        titel: data.titel,
        vorname: data.vorname,
        nachname: data.nachname,
        email: data.email
      }
      let pb=locals.pb
      let person=pb.collection('person').update(data.id, submitData)
      let secureData=pb.collection('secureData').update(data.expand.secureData.id, data.expand.secureData)
      await Promise.all([person,secureData])
      return {success:true}
    }catch {
      return {error: "Internal Server Error"}
    }
  },

  delNumber: async ({ request,locals }:any) => {
    try{
      const body = Object.fromEntries(await request.formData())
      let id=body.data
      let pb=locals.pb
      await pb.collection('telefonEintrag').delete(id)
      return {success:true}
    }catch{   
      return {error: "Internal Server Error"}
    }
  },

  addNumber: async ({ request,locals,params }:any) => {
    try{
      const body = Object.fromEntries(await request.formData())
      let pb=locals.pb

      const data = {
        "eintragTyp": body.eintragTyp,
        "nummer": body.number,
        "standort": body.standort
      }
      let telEintrag=pb.collection('telefonEintrag').create(data)
      let person=pb.collection('person').getOne(params.id)
    
      let res=await Promise.all([person,telEintrag])

      let telefonEintraege=res[0].telefonEintraege
      telefonEintraege.push(res[1].id)
      
      await pb.collection('person').update(params.id,{telefonEintraege:telefonEintraege} )
      
      return {success:true}
    }catch{   
      return {error: "Internal Server Error"}
    }
  },

  delDepartment: async ({ request,locals,params }:any) => {
    try{
      const body = Object.fromEntries(await request.formData())
      let pb=locals.pb
      let person=await pb.collection('person').getOne(params.id)
      let abteilungen=person.abteilungen
      abteilungen=abteilungen.filter((item:any) => item !== body.data)

      await pb.collection('person').update(params.id,{abteilungen:abteilungen})

      return {success:true}
    }catch{   
      return {error: "Internal Server Error"}
    }
  },

  addDepartment: async ({ request,locals,params }:any) => {
    try{
      const body = Object.fromEntries(await request.formData())
      let pb=locals.pb
      let person=await pb.collection('person').getOne(params.id)
      let abteilungen=person.abteilungen
      abteilungen.push(body.abteilung)

      await pb.collection('person').update(params.id,{abteilungen:abteilungen})

      return {success:true}
    }catch{   
      return {error: "Internal Server Error"}
    }
  },

  delCompany: async ({ request,locals,params }:any) => {
    try{
      const body = Object.fromEntries(await request.formData())
      let pb=locals.pb
      let person=await pb.collection('person').getOne(params.id)
      let standorte=person.standort
      standorte=standorte.filter((item:any) => item !== body.data)

      await pb.collection('person').update(params.id,{standort:standorte})

      return {success:true}
    }catch{   
      return {error: "Internal Server Error"}
    }
  },

  addCompany: async ({ request,locals,params }:any) => {
    try{
      const body = Object.fromEntries(await request.formData())
      let pb=locals.pb
      let person=await pb.collection('person').getOne(params.id)
      let standorte=person.standort
      standorte.push(body.standort)

      await pb.collection('person').update(params.id,{standort:standorte})

      return {success:true}
    }catch{   
      return {error: "Internal Server Error"}
    }
  }

}

export const load = async ({locals,params}:any) => {
  let pb:any

  if(!locals.pb.authStore.isValid){
    let env:any
    env=getDotEnv()
    pb = new PocketBase('http://127.0.0.1:8090')
    await pb.collection('users').authWithPassword(env.parsed.APIUser, env.parsed.APIPW)
  }else{
    pb=locals.pb
  }

  let person:any
  person=await pb.collection('person').getOne(params.id, {
    expand:"standort,abteilungen,telefonEintraege,telefonEintraege.eintragTyp,telefonEintraege.standort,secureData"})
  person=structuredClone(person)
  
  return {person}
}

