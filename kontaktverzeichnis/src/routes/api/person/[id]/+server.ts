import dbRequestHandler from "$lib/server/db/dbRequestHandler.ts"
import type { DBActionResponse } from "$lib/server/db/dbRequestHandler.ts"
import type { RequestEvent, RequestHandler } from "@sveltejs/kit"
import sql from "mssql"
import db from "$lib/server/db/db.ts"
import { readPerson } from "$lib/server/db/person.ts"

// const test2: (action: () => Promise<DBActionResponse>) => Promise<RequestHandler> = async () => {
//   const func: RequestHandler = async (action) => {
//     let transaction = new sql.Transaction(db)
//     try {
//       await transaction.begin()
//       let res = await action(transaction)
//       await transaction.commit()
//       return new Response(JSON.stringify(res), {
//         status: res.statusCode,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//     } catch {
//       await transaction.rollback()
//       return new Response('{status: "error","message":"Internal Error"}', {
//         status: 500,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//     }
//   }

//   return func
// }

export const GET: RequestHandler = async ({ params }) => {
  // console.log(params.id)
  let transaction = new sql.Transaction(db)
  await transaction.begin()
  let res = await readPerson(Number(params.id), transaction)
  // console.log(res)
  return new Response(JSON.stringify(res))
  return new Response("test", {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
