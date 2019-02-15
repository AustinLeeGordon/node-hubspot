import { RequestPromise } from 'request-promise'
import ContactProperty from './contact_property'

export type ContactPropertyMode = 'value_only' | 'value_and_history'
export type ContactFormSubmissionMode = 'all' | 'none' | 'newest' | 'oldest'

export interface ContactBaseOptions {
  property?: string[]
  propertyMode?: ContactPropertyMode
  formSubmissionMode?: ContactFormSubmissionMode
  showListMemberships?: boolean
}

export interface ContactGetOptions extends ContactBaseOptions {
  count?: number
  vidOffset?: number
}

export interface ContactGetRecentOptions extends ContactGetOptions {
  timeOffset?: number
}

export interface ContactBatchOptions extends ContactBaseOptions {
  includeDeletes?: boolean
}

export default class Contact {
  public properties = new ContactProperty(this.client)
  constructor(private client) {}

  public get(options?: ContactGetOptions): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/contacts/v1/lists/all/contacts/all',
      qs: options
    })
  }

  public getAll(options?: ContactGetOptions): RequestPromise {
    return this.get(options)
  }

  public getRecentlyModified(options?: ContactGetRecentOptions): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/contacts/v1/lists/recently_updated/contacts/recent',
      qs: options
    })
  }

  public getRecentlyCreated(options?: ContactGetRecentOptions): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/contacts/v1/lists/all/contacts/recent',
      qs: options
    })
  }

  public getByEmail(email: string, options?: ContactBaseOptions): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: `/contacts/v1/contact/email/${email}/profile`,
      qs: options
    })
  }

  public getByEmailBatch(emails: string[], options?: ContactBatchOptions): RequestPromise {
    let qs = { email: emails }
    if (options) {
      qs = Object.assign(qs, options)
    }
    return this.client._request({
      method: 'GET',
      path: '/contacts/v1/contact/emails/batch',
      qs
    })
  }

  public getById(id: number): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: `/contacts/v1/contact/vid/${id}/profile`
    })
  }

  public getByIdBatch(ids: number[], options?: ContactBatchOptions): RequestPromise {
    let qs = { vid: ids }
    if (options) {
      qs = Object.assign(qs, options)
    }
    return this.client._request({
      method: 'GET',
      path: '/contacts/v1/contact/vids/batch',
      qs
    })
  }

  public getByToken(token: string, options?: ContactBaseOptions): RequestPromise {
    let qs = {}
    if (options) {
      qs = Object.assign(qs, options)
    }
    return this.client._request({
      method: 'GET',
      path: `/contacts/v1/contact/utk/${token}/profile`,
      qs
    })
  }

  public getByTokenBatch(token: string[], options?: ContactBatchOptions): RequestPromise {
    let qs = { utk: token }
    if (options) {
      qs = Object.assign(qs, options)
    }
    return this.client._request({
      method: 'GET',
      path: '/contacts/v1/contact/utks/batch/',
      qs
    })
  }

  public delete(id: number): RequestPromise {
    return this.client._request({
      method: 'DELETE',
      path: `/contacts/v1/contact/vid/${id}`
    })
  }

  public update(
    id: number,
    data: {
      properties: Array<{
        property: string
        value: unknown
      }>
    }
  ): RequestPromise {
    return this.client._request({
      method: 'POST',
      path: `/contacts/v1/contact/vid/${id}/profile`,
      body: data
    })
  }

  public create(data: {
    properties: Array<{
      property: string
      value: unknown
    }>
  }): RequestPromise {
    return this.client._request({
      method: 'POST',
      path: '/contacts/v1/contact',
      body: data
    })
  }

  public createOrUpdate(
    email: string,
    data: {
      properties: Array<{
        property: string
        value: unknown
      }>
    }
  ): RequestPromise {
    return this.client._request({
      method: 'POST',
      path: `/contacts/v1/contact/createOrUpdate/email/${email}`,
      body: data
    })
  }

  // note: response to successful batch update is undefined by design : http://developers.hubspot.com/docs/methods/contacts/batch_create_or_update
  public createOrUpdateBatch(data: {
    email?: string
    vid?: number
    properties: Array<{
      property: string
      value: unknown
    }>
    // auditId -> use in qs
  }): RequestPromise {
    return this.client._request({
      method: 'POST',
      path: '/contacts/v1/contact/batch',
      body: data
    })
  }

  public search(
    query: string,
    options?: {
      count?: number
      offset?: number
      property?: string[]
    }
  ): RequestPromise {
    let qs = { q: query }
    if (options) {
      qs = Object.assign(qs, options)
    }
    return this.client._request({
      method: 'GET',
      path: '/contacts/v1/search/query',
      qs
    })
  }
}
