import { error, redirect } from "@sveltejs/kit"
import ldapAuth from "$lib/server/ldapAuth.ts"
import jwt from "jsonwebtoken"
import { JWT_Secret } from "$env/static/private"
import type { Actions } from "@sveltejs/kit"

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const body = Object.fromEntries(await request.formData())
    let forward = false

    if (!(body.username && body.password)) {
      return { error: "Login failed: Username or password empty" }
    }

    let displayName: string
    try {
      displayName = await ldapAuth(String(body.username), String(body.password))
    } catch (err) {
      return { error: err }
    }

    let token = jwt.sign({ displayName: displayName }, JWT_Secret, { expiresIn: "2d" })

    cookies.set("userJWT", token, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 48,
    })

    throw redirect(303, String(body.previousPage))
  },
  logout: async ({ cookies }) => {
    cookies.delete("userJWT")
  },
}
