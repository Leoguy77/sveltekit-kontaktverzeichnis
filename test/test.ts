import PocketBase from 'pocketbase';
import dotenv from 'dotenv'
let env:any
env=dotenv.config({path: '../.env'})

const pb = new PocketBase('http://127.0.0.1:8090');


await pb.collection('users').authWithPassword(env.parsed.APIUser, env.parsed.APIPW)


// let persons:any
// persons = await pb.collection('person').getList(1, 50, {
//     filter: `index ?~ "mal"`,
//     expand:"abteilungen,telefonEintraege,telefonEintraege.eintragTyp"}
// )


// const persons = await pb.collection('person').getFullList({expand:"abteilungen,telefonEintraege,telefonEintraege.eintragTyp"})
let persons:any 
persons = await pb.collection('person').getList(1, 50,{expand:"abteilungen,telefonEintraege,telefonEintraege.eintragTyp"})
console.log(persons.items[0].expand)
