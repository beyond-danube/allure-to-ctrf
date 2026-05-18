#!/usr/bin/env node
import { Command } from 'commander'
import { convertAllureResultsFromFolder, createReport, writeReport } from './convert/convertor'
import { CliOptions } from './model/cli-options'

const program = new Command()

program
  .name('allure-to-ctrf')
  .description('Convert Allure reports to CTRF JSON')
  .argument('<allure-results-folder-path>', 'path/to/allure/results/folder')
  .option('-o, --output-folder <folder>', 'path/to/ctrf/output', 'ctrf')
  .option('-f, --output-file <file>', 'ctrf-repost.json', 'ctrf-report.json')
  .action((allureFolder, options: CliOptions) => {
    try {
      const ctrfTestResults = convertAllureResultsFromFolder(allureFolder)
      const report = createReport(ctrfTestResults)
      writeReport(report, options.outputFolder, options.outputFile)
    } catch (error) {
      console.log((error as Error).message)
      process.exit()
    }
  })

program.parse()
