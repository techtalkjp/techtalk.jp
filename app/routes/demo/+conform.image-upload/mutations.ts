import { db } from '~/services/db.server'

export const upsertUploadedFile = async (
  key: string,
  contentType: string | null,
  size: number,
) => {
  return await db
    .insertInto('uploadedFiles')
    .values({ key, contentType, size })
    .onConflict((oc) =>
      oc.column('key').doUpdateSet({
        contentType,
        size,
        updatedAt: new Date().toISOString(),
      }),
    )
    .execute()
}

export const deleteUploadedFile = async (key: string) => {
  return await db.deleteFrom('uploadedFiles').where('key', '=', key).execute()
}
