import dotenv from 'dotenv'
import PocketBase from 'pocketbase';
import path from 'path'


function getDotEnv(){
  const __dirname = path.resolve()
  let env=dotenv.config({path: `${__dirname}/../.env`})
  return env
}

export async function getPublicPB(){
  let env:any
  env=getDotEnv()
  const pb = new PocketBase('http://127.0.0.1:8090')
  await pb.collection('users').authWithPassword(env.parsed.EditorUser, env.parsed.EditorPW)
  console.log(pb.authStore.isValid)
  return pb
}

