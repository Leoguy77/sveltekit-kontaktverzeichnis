
import ldap from "ldapjs"
import {AD_Searchbase,AD_Controller,AD_AccessGroupDN} from "$env/static/private"


async function validateCredentials(username: string, password: string) {
  return new Promise<string | undefined>((resolve, reject) => {
    const client = ldap.createClient({
      url: `ldap://${AD_Controller}`,
    })

    client.bind(`skk\\${username}`, password, (bindErr) => {
      if (bindErr) {
        reject("Invalid credentials")
        //throw new Error("Invalid credentials")
        return
      }
      client.search(
        AD_Searchbase,
        {
          filter: `(&(memberOf:1.2.840.113556.1.4.1941:=${AD_AccessGroupDN})(objectCategory=person)(objectClass=user)(sAMAccountName=${username}))`,
          scope: "sub",
        },
        (err, res) => {
          if (err) {
            resolve(undefined)
            return
          }
          res.on("searchEntry", (entry) => {
            let displayName = entry.attributes.find((el) => {
              if (el.type == "displayName") {
                return true
              }
            })

            if (displayName) {
              resolve(displayName.vals[0])
            }
          })

          res.on("end", (result) => {
            reject("No access rights")
            // client.unbind()
            // resolve(undefined)
            // return
          })
        }
      )
    })
    client.on("error", (err) => {
      console.log("binderror", err)
      resolve(undefined)
    })
  })
}

export const handle = async () => ({
  // return { name: "hi", id: "hi", status: 400 }
  // let credentials = { username: String(inp.username), password: String(inp.password) }

  // if (!credentials.password || !credentials.username) {
  //   throw new Error("Username or password empty")
  // }

  // event.locals.loginError = "his"

  // let user = await validateCredentials(credentials.username, credentials.password)

  // console.log(JSON.stringify(user))

  // return {
  //   name: user,
  //   id: String(credentials.username),
  //   status: 400,
  // }

})
  
