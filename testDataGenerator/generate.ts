import { faker } from '@faker-js/faker';
import PocketBase from 'pocketbase';
import dotenv from 'dotenv'
let env:any
env=dotenv.config({path: '../.env'})

const departments = [
"Personalabteilung",
"Controlling",
"Vorstand",
"Empfang",
"Informationstechnologie",
"Produktentwicklung",
"Fuhrparkverwaltung",
"Marketing",
"Unternehmenskommunikation",
"Vertrieb",
"Kundenbetreuung",
"Rechnungswesen",
"Finanzbuchhaltung"
]

const phonetyps=['52dd7fli25k7ktd', '04rh0lpszfx3s49', 'b45xv7hkvreka2s','skh52iac3dw71xx']

const pb = new PocketBase('http://127.0.0.1:8090');

await pb.admins.authWithPassword('admin@telefon.buch', 'myFirstLogin')

let departmentIds:any = []
for (let department of departments) {
    let id=await pb.collection('abteilung').create({
        "bezeichnung": department
    })
    departmentIds.push(id)
}


const locations = [
["Berlin","0302-1132"],
["Hamburg","040-45561"],
["München","0501-7856"],
["Köln","06412-349834598"],
]

let locationIds:{
    id:string,
    bezeichnung:string,
    vorwahl:string
}[]=[]

for (let location of locations) {
  let id:string = await pb.collection('standort').create({
    "bezeichnung": location[0],
    "vorwahl": location[1]
  })
  let data={id:id, bezeichnung:location[0], vorwahl:location[1]}
  locationIds.push(data)
}

// return random item of array
function getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

async function createRandomPhoneNummer(){
  const standort=getRandomItem(locationIds)
  
  const phoneNumber = faker.phone.number(standort.vorwahl + '#'.repeat(Math.floor((Math.random() * 8) + 3)))

  const id:string = await pb.collection('telefonEintrag').create({
    eintragTyp: getRandomItem(phonetyps),
    eintrag: phoneNumber,
    standort: standort.id
  })

  return id;
}

async function getDepartment(){
  return getRandomItem(departmentIds)
}




async function createRandomUser(){
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = `${firstName}.${lastName}@meinefirma.de`;
  const phoneNumber = await runRandomTimes(1,6,createRandomPhoneNummer);
  const title = faker.helpers.maybe<string>(() => faker.helpers.arrayElement(['Dr.', 'Prof.', 'Dr. med.', 'Prof. Dr.']), {probability: 0.1})
  const abteilung = await runRandomTimes(1,4,getRandomItem(departmentIds))
  
  pb.collection('person').create({
    vorname: firstName,
    nachname: lastName,
    titel: title,
    email: email,
    telefonEintraege: phoneNumber,
    abteilung: abteilung
  })

  
  
}

async function runRandomTimes(min:number,max:number,func:() => Promise<string>){
  let times=Math.floor((Math.random() * max) + min);
  let result:string[]=[]
  for (let i = 0; i < times; i++) {
    let res:string=await func()
    result.push(res)
  }
  return result
}

const user = createRandomUser();

console.log(user)
