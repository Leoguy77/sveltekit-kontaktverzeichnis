import { error, redirect } from '@sveltejs/kit'
import PocketBase from 'pocketbase';
import dotenv from 'dotenv'
import stringSimilarity from 'string-similarity'

export const actions = {
	search: async ({ request, locals }:any) => {
    const body = Object.fromEntries(await request.formData())

    if (!body.searchTxt){
      return{nodata: true}
    }

    let filter=body.searchTxt.split(" ").map((word:string)=>`index ?~ "${word}"`).join(" || ")

    let pb
    if (locals.pb.authStore.isValid){
      pb=locals.pb
    }else{
      let env:any
      env=dotenv.config({path: '../.env'})

      pb=new PocketBase('http://127.0.0.1:8090')
      await pb.collection('users').authWithPassword(env.parsed.APIUser, env.parsed.APIPW)
    }
    
    let [persons, ressources] = await Promise.all([
      pb.collection('person').getList(1, 40, {
      filter: filter,
      expand:"abteilungen,telefonEintraege,telefonEintraege.eintragTyp"}),
      pb.collection('ressource').getList(1, 40, {
        filter: filter,
        expand:"abteilungen,telefonEintraege,telefonEintraege.eintragTyp"})
    ])

    function makeIterable(value: any): any{
      if (typeof value[Symbol.iterator] === 'function'){
        return value
      }
      return [value]
    }

    let result=[]

    if(persons.items){
      for (let person of makeIterable(persons.items)){
        let name=""
        if(person.titel){name+=person.titel+" "}

        let abteilungen=[]
        if(person.expand.abteilungen){
          for (let abteilung of makeIterable(person.expand.abteilungen)) {
            abteilungen.push({id:abteilung.id,bezeichnung:abteilung.bezeichnung})
          }
        }

        let telefonEintraege=[]
        if(person.expand.telefonEintraege){
          for (let telefonEintrag of makeIterable(person.expand.telefonEintraege)) {
            telefonEintraege.push({id:telefonEintrag.id,
              nummer:telefonEintrag.nummer,
              eintragTyp:telefonEintrag.expand.eintragTyp.bezeichner
            })
          }
        }

        let similarity = stringSimilarity.compareTwoStrings(body.searchTxt, person.index)
        console.log(person)
        return null
        let data={
          similarity: similarity,
          type: "person",
          name: {name:`${name}${person.vorname} ${person.nachname}`,id: person.id},
          abteilungen: abteilungen,
          standort: person.expand.standort.bezeichnung,
          telefonEintraege: telefonEintraege
        }
        result.push(data)
      }
    }

    if(ressources.items){
      for (let ressource of makeIterable(ressources.items)){
        let abteilungen=[]
        if(ressource.expand.abteilungen){
          for (let abteilung of makeIterable(ressource.expand.abteilungen)) {
            abteilungen.push({id:abteilung.id,bezeichnung:abteilung.bezeichnung})
          }
        }

        let telefonEintraege=[]
        if(ressource.expand.telefonEintraege){
          for (let telefonEintrag of makeIterable(ressource.expand.telefonEintraege)) {
            telefonEintraege.push({id:telefonEintrag.id,
              nummer:telefonEintrag.nummer,
              eintragTyp:telefonEintrag.expand.eintragTyp.bezeichner
            })
          }
        }

        let similarity = stringSimilarity.compareTwoStrings(body.searchTxt, ressource.index)

        let data={
          similarity: similarity,
          type: "ressource",
          name: {name:ressource.bezeichner,id: ressource.id},
          // standort: ressource.expand.standort.bezeichnung,
          abteilungen: abteilungen,
          telefonEintraege: telefonEintraege
        }
        result.push(data)
      }
    }

    if(result.length > 0){
      console.log(result)
      return{data: structuredClone(result)}
    }
    return{nodata: true}
  },

};