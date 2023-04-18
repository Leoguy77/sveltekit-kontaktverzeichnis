import PocketBase, { Record } from "pocketbase"
import dotenv from "dotenv"
let env: any
env = dotenv.config({ path: "../.env" })

const pb = new PocketBase("http://127.0.0.1:8090")

await pb.collection("users").authWithPassword(env.parsed.EditorUser, env.parsed.EditorPW)

function ifNotEmpty(value: string): string {
  if (value) {
    return value + " "
  }
  return ""
}

function makeIterable(value: any): any {
  if (typeof value[Symbol.iterator] === "function") {
    return value
  }
  return [value]
}

async function setPersonIndex(person: any) {
  let index = ""
  index += ifNotEmpty(person["titel"])
  index += ifNotEmpty(person["vorname"])
  index += ifNotEmpty(person["nachname"])
  index += ifNotEmpty(person["email"])

  if (person.expand.standort) {
    for (let standort of makeIterable(person.expand.standort)) {
      index += ifNotEmpty(standort["bezeichnung"])
    }
  }

  if (person.expand.telefonEintraege) {
    for (let telefonEintrag of makeIterable(person.expand.telefonEintraege)) {
      index += ifNotEmpty(telefonEintrag["nummer"])
    }
  }

  if (person.expand.abteilungen) {
    for (let abteilung of makeIterable(person.expand.abteilungen)) {
      index += ifNotEmpty(abteilung["bezeichnung"])
      index += ifNotEmpty(abteilung["kurzBezeichnung"])
    }
  }

  let data = { index: index }
  await pb.collection("person").update(person.id, data)
}

async function setRessourceIndex(ressource: any) {
  let index = ""
  index += ifNotEmpty(ressource["bezeichner"])
  index += ifNotEmpty(ressource["email"])

  if (ressource.expand.standort) {
    for (let standort of makeIterable(ressource.expand.standort)) {
      index += ifNotEmpty(standort["bezeichnung"])
    }
  }

  if (ressource.expand.telefonEintraege) {
    for (let telefonEintrag of makeIterable(ressource.expand.telefonEintraege)) {
      index += ifNotEmpty(telefonEintrag["nummer"])
    }
  }

  if (ressource.expand.abteilungen) {
    for (let abteilung of makeIterable(ressource.expand.abteilungen)) {
      index += ifNotEmpty(abteilung["bezeichnung"])
      index += ifNotEmpty(abteilung["kurzBezeichnung"])
    }
  }

  let data = { index: index }
  await pb.collection("ressource").update(ressource.id, data)
}

const persons = await pb
  .collection("person")
  .getFullList({ expand: "standort,abteilungen,telefonEintraege,telefonEintraege.eintragTyp" })
for (let person of makeIterable(persons)) {
  setPersonIndex(person)
}

const ressources = await pb
  .collection("ressource")
  .getFullList({ expand: "standort,abteilungen,telefonEintraege,telefonEintraege.eintragTyp" })
for (let ressource of makeIterable(ressources)) {
  setRessourceIndex(ressource)
}

export { setPersonIndex }
export { setRessourceIndex }