import { CTRFReport, Test, TestStatus } from 'ctrf'
import { AllureTestResult, AllureTestStatus } from '../model/allure'
import fs from 'node:fs'
import path from 'node:path'

const statusMap = new Map<AllureTestStatus, TestStatus>([
  ['passed', 'passed'],
  ['failed', 'failed'],
  ['skipped', 'skipped'],
  ['broken', 'other']
])

function converAllureTestToCtrfTest(allureTest: AllureTestResult): Test {
  const result: Test = {
    id: allureTest.uuid,
    name: allureTest.name,
    status: statusMap.get(allureTest.status) ?? 'other',
    rawStatus: allureTest.status,
    start: allureTest.start,
    stop: allureTest.stop,
    duration: allureTest.stop - allureTest.start
  }

  return result
}

export function convertAllureResultsFromFolder(allureFolder: string): Test[] {
  if (!fs.existsSync(allureFolder)) {
    throw new Error('Allure path does not exist')
  }

  const allureResultsFiles = fs.readdirSync(allureFolder).filter(file => file.endsWith('result.json'))

  if (allureResultsFiles.length === 0) {
    throw new Error('Allure results not found on path')
  }

  const tests: Test[] = allureResultsFiles.map(allureTestFile => {
    const allureTest: AllureTestResult = JSON.parse(fs.readFileSync(path.join(allureFolder, allureTestFile)).toString())
    return converAllureTestToCtrfTest(allureTest)
  })

  return tests
}

export function createReport(tests: Test[]): CTRFReport {
  const countTests = (status: TestStatus) => tests.filter(test => test.status === status).length
  const sortedTests = [...tests].sort((a, b) => a.start! - b.start!)

  const result: CTRFReport = {
    reportFormat: 'CTRF',
    specVersion: '',
    results: {
      tool: {
        name: 'Allure'
      },
      summary: {
        tests: tests.length,
        passed: countTests('passed'),
        failed: countTests('failed'),
        skipped: countTests('skipped'),
        pending: 0,
        other: countTests('other'),
        start: sortedTests[0].start!,
        stop: sortedTests[sortedTests.length - 1].stop!
      },
      tests: sortedTests
    }
  }
  return result
}

export function writeReport(report: CTRFReport, outputFolder: string, outputFile: string) {
  fs.mkdirSync(outputFolder, { recursive: true })
  fs.writeFileSync(path.join(outputFolder, outputFile), JSON.stringify(report, null, '\t'))
}
