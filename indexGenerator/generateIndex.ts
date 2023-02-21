import PocketBase, { Record } from 'pocketbase'
import dotenv from 'dotenv'
let env:any
env=dotenv.config({path: '../.env'})

const pb = new PocketBase('http://127.0.0.1:8090')

await pb.collection('users').authWithPassword(env.parsed.APIUser, env.parsed.APIPW)

function ifNotEmpty(value: string): string{
  if (value) {
    return value+" "
  }
  return ""
}

function makeIterable(value: any): any{
  if (typeof value[Symbol.iterator] === 'function'){
    return value
  }
  return [value]
}

async function setPersonIndex(person: any){
  let index=""
  index+=ifNotEmpty(person["titel"])
  index+=ifNotEmpty(person["vorname"])
  index+=ifNotEmpty(person["nachname"])
  index+=ifNotEmpty(person["email"])
  index+=ifNotEmpty(person["standort"])
  if(person.expand.telefonEintraege){
    for (let telefonEintrag of makeIterable(person.expand.telefonEintraege)) {
      index+=ifNotEmpty(telefonEintrag.expand.eintragTyp["bezeichner"])
      index+=ifNotEmpty(telefonEintrag["nummer"])
    }
  }

  if(person.expand.abteilungen){
    for (let abteilung of makeIterable(person.expand.abteilungen)) {
      index+=ifNotEmpty(abteilung["bezeichnung"])
      index+=ifNotEmpty(abteilung["kurzBezeichnung"])
    }
  }
  
  let data={"index":index}
  await pb.collection('person').update(person.id, data)
 
}

async function setRessourceIndex(ressource:any){
  let index=""
  index+=ifNotEmpty(ressource["bezeichner"])
  if(ressource.expand.telefonEintraege){
    for (let telefonEintrag of makeIterable(ressource.expand.telefonEintraege)) {
      index+=ifNotEmpty(telefonEintrag.expand.eintragTyp["bezeichner"])
      index+=ifNotEmpty(telefonEintrag["nummer"])
    }
  }

  if(ressource.expand.abteilungen){
    for (let abteilung of makeIterable(ressource.expand.abteilungen)) {
      index+=ifNotEmpty(abteilung["bezeichnung"])
      index+=ifNotEmpty(abteilung["kurzBezeichnung"])
    }
  }
  
  let data={"index":index}
  await pb.collection('ressource').update(ressource.id, data)
}

const persons = await pb.collection('person').getFullList({expand:"abteilungen,telefonEintraege,telefonEintraege.eintragTyp"})
for (let person of makeIterable(persons)) {
  setPersonIndex(person)
}

const ressources = await pb.collection('ressource').getFullList({expand:"abteilungen,telefonEintraege,telefonEintraege.eintragTyp"})
for (let ressource of makeIterable(ressources)) {
  setRessourceIndex(ressource)
}