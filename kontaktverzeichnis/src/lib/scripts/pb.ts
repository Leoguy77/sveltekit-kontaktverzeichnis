import dotenv from 'dotenv'
import path from 'path'

export function getDotEnv(){
  const __dirname = path.resolve()
  let env=dotenv.config({path: `${__dirname}/../.env`})
  return env
}

