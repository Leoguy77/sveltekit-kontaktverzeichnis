export interface Standort {
  id: number
  bezeichnung: string
  vorwahl: string
}

export interface Abteilung {
  id: number
  bezeichnung: string
}

export interface Ressource {
  id: number
  bezeichnung: string
  email: string
  abteilung: Abteilung[]
  telefonEintrag: TelefonEintrag[]
  standort: Standort[]
}

export interface Person {
  id: number
  vorname: string
  nachname: string
  personalnummer: string
  konstenstelle: string
  email: string
  titel: string
  abteilung: Abteilung[]
  telefonEintrag: TelefonEintrag[]
  standort: Standort[]
}

export interface TelefonEintrag {
  id: number
  eintragTyp: EintragTyp
  nummer: string
  standort: Standort
}

export interface EintragTyp {
  id: number
  bezeichnung: string
}
