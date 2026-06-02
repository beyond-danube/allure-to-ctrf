import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import writeFromAllureFolderToCtrf from '../src'
import { EXPECTED_COUNTS, FIXTURE_DIR, RESULT_FILE_COUNT } from './helpers/expected'

const CUSTOM_FOLDER = 'ctrf-custom'
const CUSTOM_FILE = 'ctrf-custom.json'

function readReport(reportPath: string) {
  return JSON.parse(fs.readFileSync(reportPath, 'utf8'))
}

describe('writeFromAllureFolderToCtrf (programmatic usage)', () => {
  let tmpOut: string
  let cwd: string

  beforeEach(() => {
    tmpOut = fs.mkdtempSync(path.join(os.tmpdir(), 'allure-to-ctrf-import-'))
    cwd = process.cwd()
    process.chdir(tmpOut)
  })

  afterEach(() => {
    process.chdir(cwd)
    fs.rmSync(tmpOut, { recursive: true, force: true })
  })

  it('writes report to default folder/file when no options are given', () => {
    writeFromAllureFolderToCtrf(FIXTURE_DIR)

    const reportPath = path.join(tmpOut, 'ctrf', 'ctrf-report.json')
    expect(fs.existsSync(reportPath)).toBe(true)

    const report = readReport(reportPath)
    expect(report.results.summary).toMatchObject(EXPECTED_COUNTS)
    expect(report.results.tests).toHaveLength(RESULT_FILE_COUNT)
  })

  it('falls back to defaults for omitted option fields', () => {
    writeFromAllureFolderToCtrf(FIXTURE_DIR, { outputFile: CUSTOM_FILE })

    const reportPath = path.join(tmpOut, 'ctrf', CUSTOM_FILE)
    expect(fs.existsSync(reportPath)).toBe(true)
    expect(fs.existsSync(path.join(tmpOut, 'ctrf', 'ctrf-report.json'))).toBe(false)
  })

  it('respects custom outputFolder and outputFile options', () => {
    writeFromAllureFolderToCtrf(FIXTURE_DIR, {
      outputFolder: CUSTOM_FOLDER,
      outputFile: CUSTOM_FILE
    })

    const customPath = path.join(tmpOut, CUSTOM_FOLDER, CUSTOM_FILE)
    expect(fs.existsSync(customPath)).toBe(true)

    expect(fs.existsSync(path.join(tmpOut, 'ctrf'))).toBe(false)

    const report = readReport(customPath)
    expect(report.results.summary).toMatchObject(EXPECTED_COUNTS)
    expect(report.results.tests).toHaveLength(RESULT_FILE_COUNT)
  })
})
