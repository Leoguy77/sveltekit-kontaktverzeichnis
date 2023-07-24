import type { RequestHandler } from "@sveltejs/kit"

export const PUT: RequestHandler = async ({}) => {
  return new Response('{"message":""}', {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
