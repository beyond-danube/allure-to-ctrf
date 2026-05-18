import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { convertAllureResultsFromFolder, createReport } from '../src/convert/convertor'
import { listAllureResultFiles } from '../src/convert/validation'
import { EXPECTED_COUNTS, FIXTURE_DIR, RESULT_FILE_COUNT } from './helpers/expected'

describe('convertAllureResultsFromFolder', () => {
  it('produces one CTRF test per *-result.json file', () => {
    const tests = convertAllureResultsFromFolder(FIXTURE_DIR)
    expect(tests).toHaveLength(RESULT_FILE_COUNT)
  })
})

describe('status mapping', () => {
  const tests = convertAllureResultsFromFolder(FIXTURE_DIR)
  const countByStatus = (status: string) => tests.filter(t => t.status === status).length

  it('maps passed tests', () => {
    expect(countByStatus('passed')).toBe(EXPECTED_COUNTS.passed)
  })

  it('maps failed tests', () => {
    expect(countByStatus('failed')).toBe(EXPECTED_COUNTS.failed)
  })

  it('maps skipped tests', () => {
    expect(countByStatus('skipped')).toBe(EXPECTED_COUNTS.skipped)
  })

  it('maps broken tests to other', () => {
    expect(countByStatus('other')).toBe(EXPECTED_COUNTS.other)
    const broken = tests.find(t => t.rawStatus === 'broken')
    expect(broken?.status).toBe('other')
  })
})

describe('createReport', () => {
  it('summarises counts that match the converted tests', () => {
    const tests = convertAllureResultsFromFolder(FIXTURE_DIR)
    const report = createReport(tests)

    expect(report.reportFormat).toBe('CTRF')
    expect(report.results.tool.name).toBe('Allure')
    expect(report.results.summary).toMatchObject(EXPECTED_COUNTS)
    expect(report.results.tests).toHaveLength(RESULT_FILE_COUNT)
  })
})

describe('listAllureResultFiles', () => {
  it('throws when the folder does not exist', () => {
    expect(() => listAllureResultFiles('/no/such/folder/here')).toThrow('Allure path does not exist')
  })

  it('throws when the folder has no *-result.json files', () => {
    const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'allure-empty-'))
    try {
      expect(() => listAllureResultFiles(empty)).toThrow('Allure results not found on path')
    } finally {
      fs.rmSync(empty, { recursive: true, force: true })
    }
  })
})
