import { CTRFReport, Test, TestStatus } from 'ctrf'
import { AllureTestResult, AllureTestStatus } from '../model/allure'

const statusMap = new Map<AllureTestStatus, TestStatus>([
  ['passed', 'passed'],
  ['failed', 'failed'],
  ['skipped', 'skipped'],
  ['broken', 'other']
])

export function converAllureTestToCtrfTest(allureTest: AllureTestResult): Test {
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

export function createReport(tests: Test[]): CTRFReport {
  const countTests = (status: TestStatus) => tests.filter(test => test.status === status).length
  const sortedTests = tests.sort(test => test.start!)

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
