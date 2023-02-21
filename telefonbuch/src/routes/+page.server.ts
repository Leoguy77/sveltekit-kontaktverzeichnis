import { error, redirect } from '@sveltejs/kit'
import PocketBase from 'pocketbase';
import dotenv from 'dotenv'

export const actions = {
	search: async ({ request, locals }:any) => {
    const body = Object.fromEntries(await request.formData())

    if (body.searchTxt){
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
        pb.collection('person').getList(1, 20, {
        filter: filter,
        expand:"abteilungen,telefonEintraege,telefonEintraege.eintragTyp"}),
        pb.collection('ressource').getList(1, 20, {
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
          console.log(person)
          let name=""
          if(person.titel){name+=person.titel+" "}

          let abteilungen=[]
          console.log(person.expand)
          // for (let abteilung of makeIterable(person.expand.abteilungen)) {
          //   abteilungen.push(abteilung.bezeichnung)
          // }
          



          let data={
            id: person.id,
            name: `${name}${person.vorname} ${person.nachname}`,
            
          }

          console.log(data)
        }
      }

      if(ressources.items){
        for (let ressource of makeIterable(ressources.items)){
          
        }
      }

      if(result.length > 0){
        return{data: structuredClone(persons)}
      }
      return{nodata: true}
    }

    // let persons = await locals.pb.collection('person').getList(1, 50, {
    //   filter: 'created >= "2022-01-01 00:00:00" && someField1 != someField2',
    //   ?expand=
    // })

    // console.log(body)
	},

};