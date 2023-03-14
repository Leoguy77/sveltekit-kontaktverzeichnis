import { redirect } from "@sveltejs/kit"

export async function GET({ locals }: any) {
  let person: any
  let forward: boolean
  try {
    if (!locals?.pb?.authStore?.isValid) {
      return new Response('{"message":"Not authenticated"}', {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }
    let secureData = await locals.pb.collection("secureData").create()
    person = await locals.pb.collection("person").create({ secureData: secureData.id })
    forward = true
  } catch {
    return new Response('{"message":"Internal Error"}', {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
  if (forward) {
    throw redirect(303, `/person/id/${person.id}`)
  }
}
