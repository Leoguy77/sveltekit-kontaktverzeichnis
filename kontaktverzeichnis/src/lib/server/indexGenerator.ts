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

export function getPersonIndex(person: any) {
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

  return index
}

export function getRessourceIndex(ressource: any) {
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

  return index
}
