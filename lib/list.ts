import { RequestPromise } from 'request-promise'

export interface ListGetContactsOptions {
  count?: number
  vidOffset?: number
  property?: string[]
  propertyMode?: 'value_only' | 'value_and_history'
  formSubmissionMode?: 'all' | 'none' | 'newest' | 'oldest'
  showListMemberships?: boolean
}

export interface ListGetRecentContactsOptions extends ListGetContactsOptions {
  timeOffset?: number
}

export default class List {
  constructor(private client) {}

  public get(options?: { count?: number; offset?: number }): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/contacts/v1/lists',
      qs: options
    })
  }

  public getOne(id: number): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: `/contacts/v1/lists/${id}`
    })
  }

  public create(data: {
    name: string
    dynamic?: boolean
    filters?: Array<
      Array<{
        [x: string]: any // TODO: Fix me
      }>
    >
  }): RequestPromise {
    return this.client._request({
      method: 'POST',
      path: '/contacts/v1/lists',
      body: data
    })
  }

  public delete(id: number): RequestPromise {
    return this.client._request({
      method: 'DELETE',
      path: `/contacts/v1/lists/${id}`
    })
  }

  public getContacts(id: number, options?: ListGetContactsOptions): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: `/contacts/v1/lists/${id}/contacts/all`,
      qs: options
    })
  }

  public getRecentContacts(id: number, options?: ListGetRecentContactsOptions): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: `/contacts/v1/lists/${id}/contacts/recent`,
      qs: options
    })
  }

  public addContacts(
    id: number,
    data: {
      vids?: number[]
      emails?: string[]
    }
  ): RequestPromise {
    return this.client._request({
      method: 'POST',
      path: `/contacts/v1/lists/${id}/add`,
      body: data
    })
  }
}
