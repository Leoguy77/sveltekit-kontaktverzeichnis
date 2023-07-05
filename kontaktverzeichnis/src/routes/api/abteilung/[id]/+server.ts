import { parseEntities } from "$lib/server/entityParser.ts"
import { getDepartment, updateRow, deleteRow } from "$lib/server/dbFunctions.ts"
import db from "$lib/server/db.ts"
import mssql from "mssql"

export async function GET({ params }: any) {
  let [bezeichnung, persons, ressources] = await getDepartment(params.id, db)
  let parsedEntities = parseEntities([persons, ressources], null)
  let result = { entities: parsedEntities, department: bezeichnung[0] }
  let res = JSON.stringify(result)

  return new Response(res, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "max-age=60",
    },
  })
}

export async function POST({ locals, params, request }: any) {
  if (!locals?.pb?.authStore?.isValid) {
    return new Response('{"message":"Not authenticated"}', {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
  let json = await request.json()
  let transaction = new mssql.Transaction(db)
  await transaction.begin()
  try {
    await updateRow("abteilung", ["bezeichnung"], params.id, [json.bezeichnung], transaction)
    await transaction.commit()
  } catch (e) {
    console.log(e)
    await transaction.rollback()
    return new Response('{"message":"Internal Error"}', {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
  return new Response(JSON.stringify({ Result: "Success" }), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export async function DELETE({ locals, params }: any) {
  if (!locals?.pb?.authStore?.isValid) {
    return new Response('{"message":"Not authenticated"}', {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  await locals.pb.collection("abteilung").delete(params.id)
  let transaction = new mssql.Transaction(db)
  await transaction.begin()
  try {
    await deleteRow("abteilung", params.id, transaction)
    await transaction.commit()
  } catch (e) {
    console.log(e)
    await transaction.rollback()
    return new Response('{"message":"Internal Error"}', {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
  return new Response(JSON.stringify({ Result: "Success" }), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}
