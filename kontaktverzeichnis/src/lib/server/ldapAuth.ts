import ldap from "ldapjs"
import { AD_Searchbase, AD_Controller, AD_AccessGroupDN } from "$env/static/private"

export default async function validateCredentials(username: string, password: string) {
  return new Promise<string>((resolve, reject) => {
    const client = ldap.createClient({
      url: `ldap://${AD_Controller}`,
      timeout: 5000,
      idleTimeout: 5000,
      connectTimeout: 5000,
    })

    client.bind(`skk\\${username}`, password, (bindErr) => {
      if (bindErr) {
        reject("Invalid credentials")
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
            reject("An error occurred")
            return
          }
          res.on("searchEntry", (entry) => {
            let displayName = entry.attributes.find((el) => {
              if (el.type == "displayName") {
                return true
              }
            })

            if (displayName) {
              //@ts-ignore
              resolve(displayName.values[0])
            }
          })

          res.on("end", (result) => {
            reject("No access rights")
            return
          })
        }
      )
    })
    client.on("error", (err) => {
      reject("An error occurred")
      return
    })
  })
}
