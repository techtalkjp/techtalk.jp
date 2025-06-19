import { dir, file } from 'opfs-tools'
import type { ExcelFileInfo } from '../types'

export class OPFSManager {
  private static instance: OPFSManager
  private readonly baseDir = '/excel-analysis'

  static getInstance(): OPFSManager {
    if (!OPFSManager.instance) {
      OPFSManager.instance = new OPFSManager()
    }
    return OPFSManager.instance
  }

  async initialize(): Promise<void> {
    try {
      await dir(this.baseDir).create()
      console.log('[OPFS] Initialized excel-analysis directory')
    } catch (error) {
      console.error('[OPFS] Failed to initialize:', error)
      throw new Error('Failed to initialize OPFS')
    }
  }

  async saveExcelFile(fileName: string, fileData: ArrayBuffer): Promise<void> {
    try {
      const filePath = `${this.baseDir}/${fileName}`
      const fileHandler = file(filePath)
      const writer = await fileHandler.createWriter()
      await writer.write(fileData)
      await writer.close()
      console.log(`[OPFS] Saved Excel file: ${fileName}`)
    } catch (error) {
      console.error('[OPFS] Failed to save file:', error)
      throw new Error(`Failed to save file: ${fileName}`)
    }
  }

  async saveProcessedData(fileName: string, csvData: string): Promise<void> {
    try {
      const csvFileName = fileName.replace(/\.xlsx?$/i, '.csv')
      const filePath = `${this.baseDir}/processed/${csvFileName}`

      await dir(`${this.baseDir}/processed`).create()
      const fileHandler = file(filePath)
      const writer = await fileHandler.createWriter()
      await writer.write(csvData)
      await writer.close()
      console.log(`[OPFS] Saved processed CSV: ${csvFileName}`)
    } catch (error) {
      console.error('[OPFS] Failed to save processed data:', error)
      throw new Error(`Failed to save processed data: ${fileName}`)
    }
  }

  async getExcelFile(fileName: string): Promise<ArrayBuffer> {
    try {
      const filePath = `${this.baseDir}/${fileName}`
      const fileExists = await file(filePath).exists()

      if (!fileExists) {
        throw new Error(`File not found: ${fileName}`)
      }

      return await file(filePath).arrayBuffer()
    } catch (error) {
      console.error('[OPFS] Failed to get file:', error)
      throw new Error(`Failed to get file: ${fileName}`)
    }
  }

  async getProcessedData(fileName: string): Promise<string> {
    try {
      const csvFileName = fileName.replace(/\.xlsx?$/i, '.csv')
      const filePath = `${this.baseDir}/processed/${csvFileName}`
      const fileExists = await file(filePath).exists()

      if (!fileExists) {
        throw new Error(`Processed file not found: ${csvFileName}`)
      }

      return await file(filePath).text()
    } catch (error) {
      console.error('[OPFS] Failed to get processed data:', error)
      throw new Error(`Failed to get processed data: ${fileName}`)
    }
  }

  async listExcelFiles(): Promise<ExcelFileInfo[]> {
    try {
      const baseDirectory = dir(this.baseDir)
      const exists = await baseDirectory.exists()

      if (!exists) {
        return []
      }

      const children = await baseDirectory.children()
      const excelFiles: ExcelFileInfo[] = []

      for (const child of children) {
        if (child.kind === 'file' && /\.xlsx?$/i.test(child.name)) {
          try {
            const filePath = `${this.baseDir}/${child.name}`
            const fileHandler = file(filePath)
            const exists = await fileHandler.exists()

            if (exists) {
              // Get file stats from the OPFS file itself
              excelFiles.push({
                name: child.name,
                size: 0, // OPFS doesn't provide size info easily
                lastModified: Date.now(),
                sheets: [], // Will be populated when file is processed
              })
            }
          } catch (error) {
            console.warn(`[OPFS] Failed to get info for ${child.name}:`, error)
          }
        }
      }

      return excelFiles.sort((a, b) => b.lastModified - a.lastModified)
    } catch (error) {
      console.error('[OPFS] Failed to list files:', error)
      return []
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      const filePath = `${this.baseDir}/${fileName}`
      const csvFileName = fileName.replace(/\.xlsx?$/i, '.csv')
      const csvPath = `${this.baseDir}/processed/${csvFileName}`

      // Delete original Excel file
      const excelExists = await file(filePath).exists()
      if (excelExists) {
        await file(filePath).remove()
      }

      // Delete processed CSV file
      const csvExists = await file(csvPath).exists()
      if (csvExists) {
        await file(csvPath).remove()
      }

      console.log(`[OPFS] Deleted files for: ${fileName}`)
    } catch (error) {
      console.error('[OPFS] Failed to delete file:', error)
      throw new Error(`Failed to delete file: ${fileName}`)
    }
  }

  async getStorageUsage(): Promise<{ used: number; available?: number }> {
    try {
      // OPFS doesn't have a direct way to get storage usage
      // This is an approximation based on file sizes
      const files = await this.listExcelFiles()
      const used = files.reduce((total, file) => total + file.size, 0)

      return { used }
    } catch (error) {
      console.error('[OPFS] Failed to get storage usage:', error)
      return { used: 0 }
    }
  }

  async clearAll(): Promise<void> {
    try {
      const baseDirectory = dir(this.baseDir)
      const exists = await baseDirectory.exists()

      if (exists) {
        await baseDirectory.remove()
        await baseDirectory.create()
        console.log('[OPFS] Cleared all files')
      }
    } catch (error) {
      console.error('[OPFS] Failed to clear files:', error)
      throw new Error('Failed to clear all files')
    }
  }
}
