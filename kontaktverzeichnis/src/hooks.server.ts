import PocketBase from "pocketbase"
import dbCache from "$lib/scripts/dbCache.ts"

await dbCache.refreshCache()

export const handle = async ({ event, resolve }: any) => {
  event.locals.pb = new PocketBase("http://127.0.0.1:8090")
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