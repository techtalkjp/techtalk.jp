import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { PrismaClient } from '@prisma/client'
import { libsql } from './libsql.server'

const createPrismaClient = () => {
  const adapter = new PrismaLibSQL(libsql)
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })
}

export const prisma = createPrismaClient()
