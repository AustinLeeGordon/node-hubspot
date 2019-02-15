import { RequestPromise } from 'request-promise'
import { EmailEventType } from './types'

export default class Campaign {
  constructor(private client) {}

  public get(options?: { offset?: string; limit?: number }): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/email/public/v1/campaigns',
      qs: options
    })
  }

  public getById(options?: { offset?: string; limit?: number }): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/email/public/v1/campaigns/by-id',
      qs: options
    })
  }

  public getOne(id: number): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/email/public/v1/campaigns/' + id
    })
  }

  public events(options?: {
    appId?: number
    campaignId?: number
    recipient?: string
    eventType?: EmailEventType
    startTimestamp?: number
    endTimestamp?: number
    offset?: string
    limit?: number
    excludeFilteredEvents?: boolean
  }): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/email/public/v1/events',
      qs: options
    })
  }
}
