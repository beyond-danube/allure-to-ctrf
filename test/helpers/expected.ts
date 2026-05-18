import fs from 'node:fs'
import path from 'node:path'

export const FIXTURE_DIR = path.join(
  __dirname,
  '..',
  'test-data',
  'allure-results-examples'
)

export const RESULT_FILE_COUNT = fs
  .readdirSync(FIXTURE_DIR)
  .filter(f => f.endsWith('-result.json')).length

export const EXPECTED_COUNTS = {
  tests: RESULT_FILE_COUNT,
  passed: 18,
  failed: 1,
  skipped: 1,
  other: 1,
  pending: 0,
} as const
