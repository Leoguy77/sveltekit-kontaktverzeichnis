import type { RequestHandler } from "@sveltejs/kit"
import sql from "mssql"
import db from "./db.ts"

interface DBActionResponse {
  status: "success" | "error"
  message: string
  statusCode: number
}

type DBRequestHandler = RequestHandler extends (...a: infer U) => infer R
  ? (action: (transaction: sql.Transaction) => Promise<DBActionResponse>, ...a: U) => R
  : never

const dbRequestHandler: DBRequestHandler = async (action: (transactio: sql.Transaction) => Promise<DBActionResponse>) => {
  let transaction = new sql.Transaction(db)
  try {
    await transaction.begin()
    let res = await action(transaction)
    await transaction.commit()
    return new Response(JSON.stringify(res), {
      status: res.statusCode,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch {
    await transaction.rollback()
    return new Response('{status: "error","message":"Internal Error"}', {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

export default dbRequestHandler
