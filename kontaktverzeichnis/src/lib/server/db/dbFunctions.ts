import sql, { type IRecordSet } from "mssql"

// TODO: Auflösen

export async function readAbteilung(departmentid: number, db: sql.ConnectionPool): Promise<any> {
  let request = new sql.Request(db)
  request.input("val0", sql.Int, departmentid)
  //get persons and ressources from department
  const result = await request.query(`
  SELECT bezeichnung FROM abteilung
  WHERE id = @val0
  (SELECT
      p.id,
      p.vorname,
      p.nachname,
      p.email,
      STUFF(
          (SELECT ', ' + CONCAT(s.id, ' (', s.vorwahl, ', ', t.nummer, ', ', s.bezeichnung, ', ', et.bezeichnung, ')')
          FROM telefonEintragperson tp
          JOIN telefonEintrag t ON t.id = tp.telefonEintragID
          JOIN EintragTyp et ON et.id = t.EintragTypID
          JOIN standort s ON s.id = t.standortID
          WHERE tp.personID = p.id
          FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
          1, 2, '') AS nummern,
      STUFF(
          (SELECT ', ' + CONCAT(s.id, ' (', s.bezeichnung, ')')
          FROM standortperson sp
          JOIN standort s ON s.id = sp.standortID
          WHERE sp.personID = p.id
          GROUP BY s.id, s.bezeichnung
          FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
          1, 2, '') AS standorte,
      STUFF(
          (SELECT ', ' + CONCAT(a.id, ' (', a.bezeichnung, ')')
          FROM Personabteilung pd
          JOIN abteilung a ON a.id = pd.abteilungId
          WHERE pd.personId = p.id
          GROUP BY a.id, a.bezeichnung
          FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
          1, 2, '') AS abteilungen
    FROM Person p
    JOIN Personabteilung pd ON p.id = pd.personId
    WHERE pd.abteilungId = @val0
    GROUP BY p.id, p.vorname, p.nachname, p.email) 
    (SELECT
      r.id,
      r.bezeichnung,
      r.email,
      STUFF(
          (SELECT ', ' + CONCAT(s.id, ' (', s.vorwahl, ', ', t.nummer, ', ', s.bezeichnung, ', ', et.bezeichnung, ')')
          FROM telefonEintragressource tr
          JOIN telefonEintrag t ON t.id = tr.telefonEintragID
          JOIN EintragTyp et ON et.id = t.EintragTypID
          JOIN standort s ON s.id = t.standortID
          WHERE tr.ressourceID = r.id
          FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
          1, 2, '') AS nummern,
      STUFF(
          (SELECT ', ' + CONCAT(s.id, ' (', s.bezeichnung, ')')
          FROM standortressource sr
          JOIN standort s ON s.id = sr.standortID
          WHERE sr.ressourceID = r.id
          GROUP BY s.id, s.bezeichnung
          FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
          1, 2, '') AS standorte,
      STUFF(
          (SELECT ', ' + CONCAT(a.id, ' (', a.bezeichnung, ')')
          FROM ressourceabteilung rd
          JOIN abteilung a ON a.id = rd.abteilungID
          WHERE rd.ressourceID = r.id
          GROUP BY a.id, a.bezeichnung
          FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
          1, 2, '') AS abteilungen
    FROM ressource r
    JOIN ressourceabteilung rd ON r.id = rd.ressourceID
    WHERE rd.abteilungID = @val0
    GROUP BY r.id, r.bezeichnung, r.email)    
  `)
  return result.recordsets
}

export async function readPerson(db: sql.ConnectionPool | undefined, id: number) {
  let request = new sql.Request(db)
  request.input("val0", sql.Int, id)
  const result = await request.query(`
  SELECT
      p.id,
      p.vorname,
      p.nachname,
      p.email,
      p.personalnummer,
      p.kostenstelle,
      STUFF(
          (SELECT ', ' + CONCAT(s.id, ' (', s.vorwahl, ', ', t.nummer, ', ', s.bezeichnung, ', ', et.bezeichnung, ')')
          FROM telefonEintragperson tp
          JOIN telefonEintrag t ON t.id = tp.telefonEintragID
          JOIN EintragTyp et ON et.id = t.EintragTypID
          JOIN standort s ON s.id = t.standortID
          WHERE tp.personID = p.id
          FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
          1, 2, '') AS nummern,
      STUFF(
          (SELECT ', ' + CONCAT(s.id, ' (', s.bezeichnung, ')')
          FROM standortperson sp
          JOIN standort s ON s.id = sp.standortID
          WHERE sp.personID = p.id
          GROUP BY s.id, s.bezeichnung
          FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
          1, 2, '') AS standorte,
      STUFF(
          (SELECT ', ' + CONCAT(a.id, ' (', a.bezeichnung, ')')
          FROM Personabteilung pd
          JOIN abteilung a ON a.id = pd.abteilungId
          WHERE pd.personId = p.id
          GROUP BY a.id, a.bezeichnung
          FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
          1, 2, '') AS abteilungen
    FROM Person p
    WHERE p.id = @val0
  `)
  return result.recordset
}

export async function readRessource(db: sql.ConnectionPool | undefined, id: number) {
  let request = new sql.Request(db)
  request.input("val0", sql.Int, id)
  const result = await request.query(`
  SELECT
      r.id,
      r.bezeichnung,
      r.email,
      STUFF(
          (SELECT ', ' + CONCAT(s.id, ' (', s.vorwahl, ', ', t.nummer, ', ', s.bezeichnung, ', ', et.bezeichnung, ')')
          FROM telefonEintragressource tr
          JOIN telefonEintrag t ON t.id = tr.telefonEintragID
          JOIN EintragTyp et ON et.id = t.EintragTypID
          JOIN standort s ON s.id = t.standortID
          WHERE tr.ressourceID = r.id
          FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
          1, 2, '') AS nummern,
      STUFF(
          (SELECT ', ' + CONCAT(s.id, ' (', s.bezeichnung, ')')
          FROM standortressource sr
          JOIN standort s ON s.id = sr.standortID
          WHERE sr.ressourceID = r.id
          GROUP BY s.id, s.bezeichnung
          FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
          1, 2, '') AS standorte,
      STUFF(
          (SELECT ', ' + CONCAT(a.id, ' (', a.bezeichnung, ')')
          FROM ressourceabteilung rd
          JOIN abteilung a ON a.id = rd.abteilungID
          WHERE rd.ressourceID = r.id
          GROUP BY a.id, a.bezeichnung
          FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
          1, 2, '') AS abteilungen
    FROM ressource r
    WHERE r.id = @val0
  `)
  return result.recordset
}
