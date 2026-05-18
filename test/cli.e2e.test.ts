import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { EXPECTED_COUNTS, FIXTURE_DIR, RESULT_FILE_COUNT } from './helpers/expected'

const REPO_ROOT = path.join(__dirname, '..')
const CLI = path.join(REPO_ROOT, 'dist', 'cli.js')

const CUSTOM_FOLDER = 'ctrf-custom'
const CUSTOM_FILE = 'ctrf-custom.json'

function runCli(args: string[], cwd: string) {
  return spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: 'utf8' })
}

describe('allure-to-ctrf CLI (end-to-end)', () => {
  let tmpOut: string

  beforeAll(() => {
    execFileSync('npm', ['run', 'build'], { cwd: REPO_ROOT, stdio: 'inherit' })
  }, 60_000)

  beforeEach(() => {
    tmpOut = fs.mkdtempSync(path.join(os.tmpdir(), 'allure-to-ctrf-e2e-'))
  })

  afterEach(() => {
    fs.rmSync(tmpOut, { recursive: true, force: true })
  })

  it('writes report to default folder/file when no options are given', () => {
    const result = runCli([FIXTURE_DIR], tmpOut)

    expect(result.status).toBe(0)
    expect(result.stderr).toBe('')

    const reportPath = path.join(tmpOut, 'ctrf', 'crtf-report.json')
    expect(fs.existsSync(reportPath)).toBe(true)

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
    expect(report.results.summary).toMatchObject(EXPECTED_COUNTS)
    expect(report.results.tests).toHaveLength(RESULT_FILE_COUNT)
  })

  it('respects -o (custom folder) and -f (custom file) options', () => {
    const result = runCli(
      [FIXTURE_DIR, '-o', CUSTOM_FOLDER, '-f', CUSTOM_FILE],
      tmpOut
    )

    expect(result.status).toBe(0)
    expect(result.stderr).toBe('')

    const customPath = path.join(tmpOut, CUSTOM_FOLDER, CUSTOM_FILE)
    expect(fs.existsSync(customPath)).toBe(true)

    expect(fs.existsSync(path.join(tmpOut, 'ctrf'))).toBe(false)
    expect(fs.existsSync(path.join(tmpOut, CUSTOM_FOLDER, 'crtf-report.json'))).toBe(false)

    const report = JSON.parse(fs.readFileSync(customPath, 'utf8'))
    expect(report.results.summary).toMatchObject(EXPECTED_COUNTS)
    expect(report.results.tests).toHaveLength(RESULT_FILE_COUNT)
  })

  it('exits gracefully when the allure folder does not exist', () => {
    const result = runCli([path.join(tmpOut, 'missing')], tmpOut)

    expect(result.stdout).toContain('Allure path does not exist')
    expect(fs.existsSync(path.join(tmpOut, 'ctrf'))).toBe(false)
  })
})
