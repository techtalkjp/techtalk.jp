import { db } from '~/services/db.server'

export const listUploadedFiles = async (limit = 100) => {
  return await db
    .selectFrom('uploadedFiles')
    .select(['key', 'contentType', 'size', 'updatedAt'])
    .where('key', 'like', 'uploads/%')
    .orderBy('updatedAt', 'desc')
    .limit(limit)
    .execute()
}
