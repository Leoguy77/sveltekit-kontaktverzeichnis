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
      await pb.collection('person').update(data.id, submitData)
      await pb.collection('secureData').update(data.expand.secureData.id, data.expand.secureData)
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

