import { RequestPromise } from 'request-promise'

export default class Broadcast {
  constructor(private client) {}

  public get(options?: {
    status?: 'success' | 'waiting' | 'canceled' | 'error_fatal'
    since?: number
    channelGuid?: string
    count?: number
    offset?: number
  }): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/broadcast/v1/broadcasts',
      qs: options
    })
  }

  public getAll(broadcast_guid: string): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: `/broadcast/v1/broadcasts/${broadcast_guid}`
    })
  }
}
