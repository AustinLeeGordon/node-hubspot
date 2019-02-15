import { RequestPromise } from 'request-promise'

export default class Pipeline {
  constructor(private client) {}

  public get(options?: {}): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/deals/v1/pipelines',
      qs: options
    })
  }
}
