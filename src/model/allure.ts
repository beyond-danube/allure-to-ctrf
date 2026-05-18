export type AllureTestStatus = 'passed' | 'failed' | 'skipped' | 'broken'

// TODO: identify stages values

export interface AllureTestStep {
  name: string
  status: AllureTestStatus
  stage: string
  steps: AllureTestStep
  attachments: []
  parameters: []
  start: number
  stop: number
}

export interface AllureTestResult {
  name: string
  status: AllureTestStatus
  stage: string
  description: string
  steps: AllureTestStep[]
  attachments: []
  parameters: []
  start: number
  stop: number
  uuid: string
  historyId: string
  fullName: string
  labels: { name: string; value: string }[]
  links: []
}
