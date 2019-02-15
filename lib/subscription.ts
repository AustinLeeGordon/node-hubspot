import { RequestPromise } from 'request-promise'

export default class Subscription {
  constructor(private client) {}

  public get(options?: {
    changeType?:
      | 'SUBSCRIPTION_STATUS'
      | 'PORTAL_STATUS'
      | 'SUBSCRIPTION_SPAM_REPORT'
      | 'PORTAL_SPAM_REPORT'
      | 'PORTAL_BOUNCE'
      | 'ANY_STATUS'
      | 'ANY_SPAM_REPORT'
      | 'ANY_BOUNCE'
    startTimestamp?: number
    endTimestamp?: number
    includeSnapshots?: boolean
    offset?: string
    limit?: number
  }): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/email/public/v1/subscriptions/timeline',
      qs: options
    })
  }
}
