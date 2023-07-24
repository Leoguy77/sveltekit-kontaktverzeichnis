export interface Standort {
  id: number
  bezeichnung: string
  vorwahl: string | undefined
}

export interface Abteilung {
  id: number
  bezeichnung: string
}

export interface Ressource {
  id: number
  bezeichnung: string
  email: string | undefined
  abteilung: Abteilung[]
  telefonEintrag: TelefonEintrag[]
  standort: Standort[]
}

export interface Person {
  id: number
  vorname: string
  nachname: string
  personalnummer: string | undefined
  konstenstelle: string | undefined
  email: string | undefined
  titel: string | undefined
  abteilung: Abteilung[]
  telefonEintrag: TelefonEintrag[]
  standort: Standort[]
}

export interface TelefonEintrag {
  id: number
  eintragTyp: EintragTyp
  nummer: string
  standort: Standort | undefined
}

export interface EintragTyp {
  id: number
  bezeichnung: string
}
