#!/usr/bin/env node
import { Command } from 'commander'
import { CTRFReport, Test } from 'ctrf'
import fs from 'node:fs'
import path from 'node:path'
import { AllureTestResult } from './model/allure'
import { converAllureTestToCtrfTest, createReport } from './convert/convertor'
import { CliOptions } from './model/cli-options'

const program = new Command()

program
  .name('allure-to-ctrf')
  .description('Convert Allure reports to CTRF JSON')
  .argument('<allure-results-folder-path>', 'path/to/allure/results/folder')
  .option('-o, --output-folder <folder>', 'path/to/ctrf/output', 'ctrf')
  .option('-f, --output-file <file>', 'crtf-repost.json', 'crtf-report.json')
  .action((allureFolder, options: CliOptions) => {
    if (!fs.existsSync(allureFolder)) {
      console.log('Allure path does not exist')
      return
    }

    const allureResultsFiles = fs.readdirSync(allureFolder).filter(file => file.endsWith('result.json'))

    if (allureResultsFiles.length === 0) {
      console.log('Allure results not found on path')
    }

    const ctrfTestResults: Test[] = []

    allureResultsFiles.forEach(file => {
      const allureTest: AllureTestResult = JSON.parse(fs.readFileSync(path.join(allureFolder, file)).toString())
      const ctrfTest = converAllureTestToCtrfTest(allureTest)
      ctrfTestResults.push(ctrfTest)
    })

    const report = createReport(ctrfTestResults)

    fs.mkdirSync(options.outputFolder, { recursive: true })
    fs.writeFileSync(path.join(options.outputFolder, options.outputFile), JSON.stringify(report, null, '\t'))
  })

program.parse()
