export type AllureTestStatus = 'passed' | 'failed' | 'skipped' | 'broken'

export interface AllureTestResult {
  name: string
  status: AllureTestStatus
  stage: string
  description: string
  steps: []
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
