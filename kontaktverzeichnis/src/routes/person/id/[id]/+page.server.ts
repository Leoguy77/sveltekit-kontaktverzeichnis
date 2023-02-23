import { error, redirect } from '@sveltejs/kit'
import {getDotEnv} from '$lib/scripts/pb.js'
import PocketBase from 'pocketbase'

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