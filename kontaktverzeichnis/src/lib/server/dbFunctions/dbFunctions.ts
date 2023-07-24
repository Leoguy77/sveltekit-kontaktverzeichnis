import sql, { type IRecordSet } from "mssql"

export async function bulkInsert(
  tableName: string,
  columns: [string, boolean][],
  values: (string | undefined)[][],
  db: sql.ConnectionPool
) {
  let table = new sql.Table(tableName)
  table.create = false
  for (let column of columns) {
    table.columns.add(column[0], sql.VarChar, { nullable: column[1] })
  }

  for (let row of values) {
    table.rows.add(...row)
  }
  let request = new sql.Request(db)
  let query = await request.query(`SELECT IDENT_CURRENT('${tableName}') as id`)
  let minId = Number(query.recordset[0].id) + 1

  request = new sql.Request(db)
  let res = await request.bulk(table)

  let ids = []
  for (let i = minId; i < minId + res.rowsAffected; i++) {
    ids.push(i)
  }

  return ids
}

export async function insertRow(
  tableName: string,
  columns: string[],
  values: (string | undefined | number)[],
  transaction?: sql.Transaction
) {
  if (columns.length != values.length) {
    throw new Error("DB Insert: columns and values must have the same length")
  }
  let request: sql.Request
  if (transaction) {
    request = new sql.Request(transaction)
  } else {
    request = new sql.Request()
  }

  let colomnString = columns.join(",")
  let valueString = columns.map((v) => "@" + v).join(",")
  for (let i = 0; i < columns.length; i++) {
    request.input(columns[i], values[i])
  }
  let id = await request.query(`INSERT INTO ${tableName} (${colomnString}) OUTPUT Inserted.ID VALUES (${valueString})`)
  return id.recordset[0].ID
}

export async function updateRow(
  tableName: string,
  columns: string[],
  id: number,
  newValues: (string | undefined | number)[],
  transaction: sql.Transaction
) {
  if (columns.length != newValues.length) {
    throw new Error("DB Insert: columns and values must have the same length")
  }

  let request = new sql.Request(transaction)

  let setString = ""
  for (let i = 0; i < columns.length; i++) {
    request.input(columns[i], newValues[i])
    setString += columns[i] + "=@" + columns[i] + ","
  }
  setString = setString.substring(0, setString.length - 1)

  request.input("id", sql.Int, id)

  await request.query(`UPDATE ${tableName} SET ${setString} WHERE id=@id`)
}

export async function deleteRow(tableName: string, id: number, transaction: sql.Transaction) {
  let request = new sql.Request(transaction)

  request.input("val0", sql.Int, id)

  await request.query(`DELETE FROM ${tableName} WHERE id=@val0`)
}

export async function deletePerson(personId: number, transaction: sql.Transaction) {
  let request = new sql.Request(transaction)

  request.input("val0", sql.Int, personId)

  await request.query(`EXEC deletePerson @val0`)
}

export async function deleteJunction(tableName: string, columns: string[], id1: number, id2: number, transaction: sql.Transaction) {
  if (columns.length != 2) {
    throw new Error("DB Junction Delete: columns and values must have the same length")
  }

  let request = new sql.Request(transaction)

  request.input("val0", sql.Int, id1)
  request.input("val1", sql.Int, id2)

  await request.query(`DELETE FROM ${tableName} WHERE ${columns[0]}=@val0 and ${columns[1]}=@val1`)
}

export async function insertJunction(tableName: string, columns: string[], id1: number, id2: number, transaction: sql.Transaction) {
  if (columns.length != 2) {
    throw new Error("DB Junction Insert: columns and values must have the same length")
  }

  let request = new sql.Request(transaction)

  request.input("val0", sql.Int, id1)
  request.input("val1", sql.Int, id2)

  await request.query(`INSERT INTO ${tableName} (${columns.join(",")}) VALUES (@val0, @val1)`)
}
//search all tables for a string and return any person or ressource that matches
export async function searchAllPersons(searchString: string, db: sql.ConnectionPool) {
  let request = new sql.Request(db)
  let table = new sql.Table("SearchTableType")
  table.columns.add("String", sql.VarChar(50))
  searchString.split(" ").forEach((word) => {
    table.rows.add(word)
  })
  request.input("SearchTable", table)
  const result = await request.execute("SearchAllPersons")
  return result.recordset
}

export async function SearchAllRessources(searchString: string, db: sql.ConnectionPool) {
  let request = new sql.Request(db)
  let table = new sql.Table("SearchTableType")
  table.columns.add("String", sql.VarChar(50))
  searchString.split(" ").forEach((word) => {
    table.rows.add(word)
  })
  request.input("SearchTable", table)
  const result = await request.execute("SearchAllRessources")

  return result.recordset
}

export async function SearchAll(searchString: string, db: sql.ConnectionPool): Promise<any> {
  let request = new sql.Request(db)
  let table = new sql.Table("SearchTableType")
  table.columns.add("String", sql.VarChar(50))
  searchString.split(" ").forEach((word) => {
    table.rows.add(word)
  })
  request.input("SearchTable", table)
  const result = await request.execute("SearchAll")
  return result.recordsets
}

export async function getDepartments(db: sql.ConnectionPool) {
  let request = new sql.Request(db)
  //get all departments with count of persons from junction table
  const result = await request.query(`
  SELECT d.id, d.bezeichnung, COUNT(pd.personId) as count
  FROM abteilung d
  LEFT JOIN Personabteilung pd ON d.id = pd.abteilungId
  GROUP BY d.id, d.bezeichnung
  ORDER BY count DESC

  `)

  return result.recordset
}

export async function getDepartment(departmentid: number, db: sql.ConnectionPool): Promise<any> {
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

export async function getPerson(db: sql.ConnectionPool | undefined, id: number) {
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

export async function getRessource(db: sql.ConnectionPool | undefined, id: number) {
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

export async function getAllStandorte(db: sql.ConnectionPool) {
  let standorte = (await db.query("SELECT * FROM standort")).recordset
  return standorte[0]
}

export async function createDepartment(db: sql.ConnectionPool, name: string) {
  let result = insertRow("abteilung", ["bezeichnung"], [name])
  return result
}

export async function getEintragTypen(db: sql.ConnectionPool) {
  let result = await db.query("SELECT * FROM EintragTyp")
  return result.recordset
}

export async function getJSONData(personId: number, transaction: sql.Transaction) {
  let request = new sql.Request(transaction)

  request.input("val0", sql.Int, personId)

  await request.query(`EXEC deletePerson @val0`)
}
