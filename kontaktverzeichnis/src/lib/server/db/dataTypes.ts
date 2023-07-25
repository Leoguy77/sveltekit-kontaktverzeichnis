export interface Standort {
  id: number
  bezeichnung: string
  vorwahl: string | null
}

export interface Abteilung {
  id: number
  bezeichnung: string
}

export interface Ressource {
  id: number
  bezeichnung: string
  email: string | null
  abteilung: Abteilung[]
  telefonEintrag: TelefonEintrag[]
  standort: Standort[]
}

export class Person {
  id: number
  vorname: string
  nachname: string
  personalnummer: string | null
  kostenstelle: string | null
  email: string | null
  titel: string | null
  telefonEintrag: TelefonEintrag[]
  abteilung: Abteilung[]
  standort: Standort[]
  constructor(parseStr: string) {
    const parseRes = JSON.parse(parseStr)[0]
    this.id = parseRes.id
    this.vorname = parseRes.vorname
    this.nachname = parseRes.nachname
    this.personalnummer = parseRes.personalnummer || null
    this.kostenstelle = parseRes.kostenstelle || null
    this.email = parseRes.email || null
    this.titel = parseRes.titel || null
    this.telefonEintrag = parseRes.telefonEintrag
    this.abteilung = parseRes.abteilung
    this.standort = parseRes.standort
  }
}

export interface TelefonEintrag {
  id: number
  eintragTyp: EintragTyp
  nummer: string
  standort: Standort | null
}

export interface EintragTyp {
  id: number
  bezeichnung: string
}
