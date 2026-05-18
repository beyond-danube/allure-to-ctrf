import fs from 'node:fs'

export function listAllureResultFiles(folderPath: string): string[] {
  if (!fs.existsSync(folderPath)) {
    throw new Error('Allure path does not exist')
  }

  const files = fs
    .readdirSync(folderPath)
    .filter(file => file.endsWith('result.json'))

  if (files.length === 0) {
    throw new Error('Allure results not found on path')
  }

  return files
}
