import { RequestPromise } from 'request-promise'
import DealProperty from './deal_property'

export default class Deal {
  public properties = new DealProperty(this.client)
  constructor(private client) {}

  public get(options?: {
    limit?: number
    offset?: number
    properties?: string[]
    propertiesWithHistory?: string[]
    includeAssociations?: boolean
  }): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/deals/v1/deal/paged',
      qs: options,
      useQuerystring: true
    })
  }

  public getRecentlyModified(options?: {
    limit?: number
    offset?: number
    since?: number
    includePropertyVersions?: boolean
  }): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/deals/v1/deal/recent/modified',
      qs: options
    })
  }

  public getRecentlyCreated(options?: {
    limit?: number
    offset?: number
    since?: number
    includePropertyVersions?: boolean
  }): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/deals/v1/deal/recent/created',
      qs: options
    })
  }

  public getById(id: number): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: `/deals/v1/deal/${id}`
    })
  }

  // depreciated
  public getAssociated(
    objectType: 'contact' | 'company',
    objectId: number,
    options?: {
      limit?: number
      offset?: number
      properties?: string[]
      propertiesWithHistory?: string[]
      includeAssociations?: boolean
    }
  ): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: `/deals/v1/deal/associated/${objectType}/${objectId}/paged`,
      qs: options
    })
  }

  public deleteById(id: number): RequestPromise {
    return this.client._request({
      method: 'DELETE',
      path: `/deals/v1/deal/${id}`
    })
  }

  public updateById(id: number, data): RequestPromise {
    return this.client._request({
      method: 'PUT',
      path: `/deals/v1/deal/${id}`,
      body: data
    })
  }

  public create(data: {
    properties: Array<{
      name: string
      value: unknown
    }>
    dealstage: string
    associations?: {
      associatedCompanyIds?: number[]
      associatedVids?: number[]
    }
    pipeline: string
  }): RequestPromise {
    return this.client._request({
      method: 'POST',
      path: '/deals/v1/deal',
      body: data
    })
  }

  // depr
  public associate(id: number, objectType: 'contact' | 'company', options: string | string[]): RequestPromise {
    const qs = { id: options }
    return this.client._request({
      method: 'PUT',
      path: `/deals/v1/deal/${id}/associations/${objectType}`,
      qs
    })
  }

  // depr
  public removeAssociation(id: number, objectType: 'contact' | 'company', options: string | string[]): RequestPromise {
    const qs = { id: options }
    return this.client._request({
      method: 'DELETE',
      path: `/deals/v1/deal/${id}/associations/${objectType}`,
      qs
    })
  }
}
