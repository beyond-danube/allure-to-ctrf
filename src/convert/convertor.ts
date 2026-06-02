import { CTRFReport, Step, Test, TestStatus } from 'ctrf'
import { AllureTestResult, AllureTestStatus, AllureTestStep } from '../model/allure'
import fs from 'node:fs'
import path from 'node:path'
import { AllureConvertionOptions, defaultOptions } from '../model/options'

const statusMap = new Map<AllureTestStatus, TestStatus>([
  ['passed', 'passed'],
  ['failed', 'failed'],
  ['skipped', 'skipped'],
  ['broken', 'other']
])

function converAllureTestToCtrfTest(allureTest: AllureTestResult): Test {
  const mapSteps = (allureTestSteps: AllureTestStep[]): Step[] => {
    return [...allureTestSteps].map(step => {
      const result: Step = {
        name: step.name,
        status: statusMap.get(allureTest.status) ?? 'other'
      }

      return result
    })
  }

  const result: Test = {
    id: allureTest.uuid,
    name: allureTest.name,
    status: statusMap.get(allureTest.status) ?? 'other',
    rawStatus: allureTest.status,
    start: allureTest.start,
    stop: allureTest.stop,
    steps: mapSteps(allureTest.steps),
    duration: allureTest.stop - allureTest.start
  }

  return result
}

export function listAllureResultFiles(folderPath: string): string[] {
  if (!fs.existsSync(folderPath)) {
    throw new Error('Allure path does not exist')
  }

  const files = fs.readdirSync(folderPath).filter(file => file.endsWith('result.json'))

  if (files.length === 0) {
    throw new Error('Allure results not found on path')
  }

  return files
}

export function convertAllureResultsFromFolder(allureFolder: string): Test[] {
  const allureResultsFiles = listAllureResultFiles(allureFolder)

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

export function writeFromAllureFolderToCtrf(
  allureFolder: string,
  options: Partial<AllureConvertionOptions> = {}
): void {
  const { outputFolder, outputFile } = { ...defaultOptions, ...options }
  const ctrfTests = convertAllureResultsFromFolder(allureFolder)
  const report = createReport(ctrfTests)
  writeReport(report, outputFolder, outputFile)
}
