# Convert Allure JSON to CTRF JSON

An Allure JSON test results converter to create test reports that follow the CTRF standard.

[Common Test Report Format](https://ctrf.io) ensures the generation of uniform JSON test reports, independent of programming languages or test framework in use.

## CTRF Open Standard

CTRF is a community-driven open standard for test reporting.

By standardizing test results, reports can be validated, merged, compared, and analyzed consistently across languages and frameworks.

- **CTRF Specification**: https://github.com/ctrf-io/ctrf  
  The official specification defining the format and semantics
- **Discussions**: https://github.com/orgs/ctrf-io/discussions  
  Community forum for questions, ideas, and support

> [!NOTE]  
> ⭐ Starring the **CTRF specification repository** (https://github.com/ctrf-io/ctrf)
> helps support the standard.

## Features

![Static Badge](https://img.shields.io/badge/official-red?label=ctrf&labelColor=green)
[![build](https://github.com/ctrf-io/playwright-ctrf-json-report/actions/workflows/main.yaml/badge.svg)](https://github.com/ctrf-io/playwright-ctrf-json-report/actions/workflows/main.yaml)
![NPM Downloads](https://img.shields.io/npm/d18m/playwright-ctrf-json-reporter?logo=npm)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/playwright-ctrf-json-reporter?label=Size)
![GitHub Repo stars](https://img.shields.io/github/stars/ctrf-io/playwright-ctrf-json-report)

- Generate JSON test reports that are [CTRF](https://ctrf.io) compliant
- Customizable output options, minimal or comprehensive reports
- Straightforward integration with Playwright
- Enhanced test insights with detailed test information, environment details, and more.

```json
{
  "results": {
    "tool": {
      "name": "playwright"
    },
    "summary": {
      "tests": 1,
      "passed": 1,
      "failed": 0,
      "pending": 0,
      "skipped": 0,
      "other": 0,
      "start": 1706828654274,
      "stop": 1706828655782
    },
    "tests": [
      {
        "name": "ctrf should generate the same report with any tool",
        "status": "passed",
        "duration": 100
      }
    ],
    "environment": {
      "appName": "MyApp",
      "buildName": "MyBuild",
      "buildNumber": "1"
    }
  }
}
```

## Usage

This package can be used via the CLI.

## CLI Usage

```sh
npx allure-to-ctrf path/to/allure-results
```

## CLI Options

`-o`, `--output-folder` <output-folder>: Output directory for the CTRF report. If not provided, defaults to ctrf.
  
`-f`, `--output-file` <output-file>: Output filename for the CTRF report. If not provided, defaults to ctrf-report.json.

## Examples

Convert Allure JSON reports to the default CTRF report location (ctrf/ctrf-report.json):

```sh
npx allure-to-ctrf path/to/allure-results
```

### Specify Output Folder and File

Convert Allure JSON reports to a specified output file:

```sh
npx allure-to-ctrf path/to/allure-results -o report -f combined-report.json
```

## What is CTRF?

CTRF is a universal JSON test report schema that addresses the lack of a standardized format for JSON test reports.

**Consistency Across Tools:** Different testing tools and frameworks often produce reports in varied formats. CTRF ensures a uniform structure, making it easier to understand and compare reports, regardless of the testing tool used.

**Language and Framework Agnostic:** It provides a universal reporting schema that works seamlessly with any programming language and testing framework.

**Facilitates Better Analysis:** With a standardized format, programatically analyzing test outcomes across multiple platforms becomes more straightforward.
