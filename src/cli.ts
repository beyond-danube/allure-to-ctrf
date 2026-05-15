#!/usr/bin/env node
import { Command } from 'commander'
import { CTRFReport, Test } from 'ctrf'
import fs from 'node:fs'
import path from 'node:path'
import { AllureTestResult } from './model/allure'
import { converAllureTestToCtrfTest, createReport } from './convert/convertor'

const program = new Command()

program
  .name('allure-to-ctrf')
  .description('Convert Allure reports to CTRF JSON')
  .argument('<allure-results-folder-path>', 'path/to/allure/results/folder')
  .option('-o, --output-folder', 'path/to/ctrf/output', 'crtf-repost.json')
  .option('-f, --output-file', 'crtf-repost.json', 'crtf-repost.json')
  .action((allureFolder, options) => {
    if (!fs.existsSync(allureFolder)) {
      console.log('Path does not exist')
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

    if (!fs.existsSync('ctrf')) {
      fs.mkdirSync('ctrf')
    }

    fs.writeFileSync('ctrf/ctrf-report.json', JSON.stringify(report, null, '\t'))
  })

program.parse()
