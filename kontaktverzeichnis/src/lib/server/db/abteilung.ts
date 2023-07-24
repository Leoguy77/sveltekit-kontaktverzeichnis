import sql from "mssql"
import { insertRow } from "./helper.ts"

export async function createAbteilung(db: sql.ConnectionPool, name: string) {
  let result = insertRow("abteilung", ["bezeichnung"], [name])
  return result
}

export async function readAbteilungen(db: sql.ConnectionPool) {
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
