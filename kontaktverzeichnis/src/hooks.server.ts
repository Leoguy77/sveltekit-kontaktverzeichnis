import type { Handle } from "@sveltejs/kit"
import { redirect } from "@sveltejs/kit"
import jwt from "jsonwebtoken"
import { JWT_Secret } from "$env/static/private"

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get("userJWT")

  if (token) {
    try {
      // jsonwebtoken valides exp and signature
      let decoded = jwt.verify(token, JWT_Secret) as { displayName: string; exp: number; iat: number }
      event.locals.user = { displayName: decoded.displayName }

      let newToken = jwt.sign({ displayName: decoded.displayName }, JWT_Secret, { expiresIn: "2d" })
      event.cookies.set("userJWT", newToken, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 48,
      })
    } catch (err) {
      console.log(err)
      event.cookies.delete("userJWT")
      throw redirect(303, "/login")
    }
  } else {
    event.locals.user = null
  }

  return await resolve(event)
}
