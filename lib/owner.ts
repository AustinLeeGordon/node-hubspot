import { RequestPromise } from 'request-promise'

export default class Owner {
  constructor(private client) {}

  public get(options?: { includeInactive?: true; email?: string }): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/owners/v2/owners',
      qs: options
    })
  }
}
