import PocketBase from "pocketbase"
import dbCache from "$lib/server/dbCache.ts"
import { SERVER } from "$env/static/private"

export const handle = async ({ event, resolve }: any) => {
  event.locals.pb = new PocketBase(`http://${SERVER}`)
  event.locals.pb.authStore.loadFromCookie(event.request.headers.get("cookie") || "")

  if (event.locals.pb.authStore.isValid) {
    event.locals.user = structuredClone(event.locals.pb.authStore.model)
  } else {
    event.locals.user = undefined
  }

  const response = await resolve(event)

  response.headers.set("set-cookie", event.locals.pb.authStore.exportToCookie({ secure: false })) //TODO: secure: true

  return response
}
