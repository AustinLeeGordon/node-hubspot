import { RequestPromise } from 'request-promise'

export default class Page {
  constructor(private client) {}

  public get(options?: {
    limit?: number
    offset?: number
    ab_test_id?: string
    archived?: boolean
    campaign?: string
  }): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/content/api/v2/pages',
      qs: options
    })
  }
}
