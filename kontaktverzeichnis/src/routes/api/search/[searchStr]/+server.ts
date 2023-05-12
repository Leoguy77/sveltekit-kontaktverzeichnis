import dbCache from "$lib/scripts/dbCache.ts"
import { parseEntities } from "$lib/scripts/entityParser.ts"
import { building } from "$app/environment"

export async function GET({ params }: any) {
  if (building) {
    return
  }
  try {
    let searchStr = params.searchStr

    function normalSearch() {
      let [persons, ressources] = dbCache.getEntities()

      let result: any = parseEntities([persons, ressources], searchStr)

      result.sort((a: any, b: any) => {
        if (a.similarity > b.similarity) {
          return -1
        }
        if (a.similarity < b.similarity) {
          return 1
        }
        return 0
      })

      if (result.length > 50) {
        result = result.slice(0, 50)
      }

      let res = JSON.stringify(result)
      return res
    }

    if (searchStr.length < 3) {
      return new Response('{"message":"The searchStr must be longer than 2 symbols"}', {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    let res = normalSearch()

    return new Response(res, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "max-age=60",
      },
    })
  } catch {
    return new Response('{"message":"Internal Error"}', {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
