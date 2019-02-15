import { RequestPromise } from 'request-promise'

export interface EngagementBaseOptions {
  limit?: number
  offset?: number
}

export interface EngagementRecentOptions extends EngagementBaseOptions {
  since?: number
}

export default class Engagement {
  constructor(private client) {}

  public get(id: number): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: `/engagements/v1/engagements/${id}`
    })
  }

  public getAll(options?: EngagementBaseOptions): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/engagements/v1/engagements/paged',
      qs: options
    })
  }

  public getRecentlyModified(options?: EngagementRecentOptions): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/engagements/v1/engagements/recent/modified',
      qs: options
    })
  }

  // depr -> CRM Associations API
  public getAssociated(
    objectType: 'contact' | 'company' | 'deal',
    objectId: number,
    options?: EngagementBaseOptions
  ): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: `/engagements/v1/engagements/associated/${objectType}/${objectId}/paged`,
      qs: options
    })
  }

  public create(data: {}): RequestPromise {
    return this.client._request({
      method: 'POST',
      path: '/engagements/v1/engagements',
      body: data
    })
  }

  public getCallDispositions(): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/calling/v1/dispositions'
    })
  }
}
