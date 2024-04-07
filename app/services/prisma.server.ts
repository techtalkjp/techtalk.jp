import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { PrismaClient } from '@prisma/client'
import { libsql } from './libsql.server'

const createPrismaClient = () => {
  return new PrismaClient({ adapter: new PrismaLibSQL(libsql) })
}

export const prisma = createPrismaClient()
