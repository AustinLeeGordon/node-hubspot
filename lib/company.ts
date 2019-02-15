import { RequestPromise } from 'request-promise'
import CompanyProperty from './company_property'

export interface CompanyGetOptions {
  limit?: number
  offset?: number
  properties?: string[]
  propertiesWithHistory?: string[]
}

export interface CompanyGetRecentOptions {
  offset?: number
  count?: number
}

export interface CompanyGetContactOptions {
  vidOffset?: number
  count?: number
}

export default class Company {
  public properties = new CompanyProperty(this.client)
  constructor(private client) {}

  public getById(id: number): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: `/companies/v2/companies/${id}`
    })
  }

  public get(options?: CompanyGetOptions): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/companies/v2/companies/paged',
      qs: options
    })
  }

  public getAll(options?: CompanyGetOptions): RequestPromise {
    return this.get(options)
  }

  public getRecentlyCreated(options?: CompanyGetRecentOptions): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/companies/v2/companies/recent/created',
      qs: options
    })
  }

  public getRecentlyModified(options?: CompanyGetRecentOptions): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/companies/v2/companies/recent/modified',
      qs: options
    })
  }

  // depr
  public getByDomain(domain: string): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: `/companies/v2/companies/domain/${domain}`
    })
  }

  public create(data?: {}): RequestPromise {
    return this.client._request({
      method: 'POST',
      path: '/companies/v2/companies/',
      body: data
    })
  }

  public delete(id: string): RequestPromise {
    return this.client._request({
      method: 'DELETE',
      path: `/companies/v2/companies/${id}`
    })
  }

  public update(
    id: number,
    data: {
      properties: Array<{
        name: string
        value: unknown
      }>
    }
  ): RequestPromise {
    return this.client._request({
      method: 'PUT',
      path: `/companies/v2/companies/${id}`,
      body: data
    })
  }

  public updateBatch(
    data: Array<{
      objectId: number
      properties: {
        name: string
        value: unknown
      }
    }>
  ): RequestPromise {
    return this.client._request({
      method: 'POST',
      path: '/companies/v1/batch-async/update',
      body: data
    })
  }

  // depr
  public addContactToCompany(data: { companyId: number; contactVid: number }): RequestPromise {
    return this.client._request({
      method: 'PUT',
      path: `/companies/v2/companies/${data.companyId}/contacts/${data.contactVid}`
    })
  }

  // depr
  public getContactIds(id: number, options?: CompanyGetContactOptions): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: `/companies/v2/companies/${id}/vids`,
      qs: options
    })
  }

  public getContacts(id: number, options?: CompanyGetContactOptions): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: `/companies/v2/companies/${id}/contacts`,
      qs: options
    })
  }
}
