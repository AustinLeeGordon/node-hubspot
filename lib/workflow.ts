import { RequestPromise } from 'request-promise'

export default class Workflow {
  constructor(private client) {}

  public get(
    workflowId: number,
    options?: {
      errors?: boolean
      stats?: boolean
    }
  ): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: `/automation/v3/workflows/${workflowId}`,
      qs: options
    })
  }

  public getAll(): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/automation/v3/workflows'
    })
  }

  public enroll(workflowId: number, email: string): RequestPromise {
    return this.client._request({
      method: 'POST',
      path: `/automation/v2/workflows/${workflowId}/enrollments/contacts/${email}`
    })
  }

  public unenroll(workflowId: number, email: string): RequestPromise {
    return this.client._request({
      method: 'DELETE',
      path: `/automation/v2/workflows/${workflowId}/enrollments/contacts/${email}`
    })
  }

  public current(contactId: number): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: `/automation/v2/workflows/enrollments/contacts/${contactId}`
    })
  }
}
