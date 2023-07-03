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

  if (person.standorte) {
    const standortRegex = /\((.*?)\)/g
    const standortNamen = [...person.standorte.matchAll(standortRegex)].map((match) => match[1])
    for (let standort of standortNamen) {
      index += ifNotEmpty(standort)
      //console.log("standort: " + person.standorte)
    }
  }

  if (person.nummern) {
    const regex = /\(([^)]+)\)/g
    let nummern = [...person.nummern.matchAll(regex)].map((match) => match[1].split(",")[1].trim())
    for (let telefonEintrag of makeIterable(nummern)) {
      index += ifNotEmpty(telefonEintrag)
    }
  }

  if (person.abteilungen) {
    const allesinklammernregex = /\((.*?)\)/g
    const abteilungsnamen = [...person.abteilungen.matchAll(allesinklammernregex)].map((match) => match[1])
    for (let abteilung of makeIterable(abteilungsnamen)) {
      index += ifNotEmpty(abteilung)
    }
  }

  return index
}

export function getRessourceIndex(ressource: any) {
  let index = ""
  index += ifNotEmpty(ressource["bezeichnung"])
  index += ifNotEmpty(ressource["email"])

  if (ressource.standorte) {
    const standortRegex = /\((.*?)\)/g
    const standortNamen = [...ressource.standorte.matchAll(standortRegex)].map((match) => match[1])
    for (let standort of standortNamen) {
      index += ifNotEmpty(standort)
      //console.log("standort: " + ressource.standorte)
    }
  }

  if (ressource.nummern) {
    const regex = /\(([^)]+)\)/g
    let nummern = [...ressource.nummern.matchAll(regex)].map((match) => match[1].split(",")[1].trim())
    for (let telefonEintrag of makeIterable(nummern)) {
      index += ifNotEmpty(telefonEintrag)
    }
  }

  if (ressource.abteilungen) {
    const allesinklammernregex = /\((.*?)\)/g
    const abteilungsnamen = [...ressource.abteilungen.matchAll(allesinklammernregex)].map((match) => match[1])
    for (let abteilung of makeIterable(abteilungsnamen)) {
      index += ifNotEmpty(abteilung)
    }
  }

  return index
}
