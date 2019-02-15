import { RequestPromise } from 'request-promise'
import { PropertyFieldType, PropertyType } from './types'

export interface ContactPropertyBaseData {
  description?: string
  options?: Array<{ label: string; value: unknown }>
  displayOrder?: number
  formField?: boolean
}

export interface ContactPropertyCreateData extends ContactPropertyBaseData {
  name: string
  label: string
  groupName: string
  type: PropertyType
  fieldType: PropertyFieldType
}

export interface ContactPropertyUpdateData extends ContactPropertyBaseData {
  label?: string
  groupName?: string
  type?: PropertyType
  fieldType?: PropertyFieldType
}

export default class ContactProperty {
  constructor(private client) {}

  public getAll(): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/properties/v1/contacts/properties'
    })
  }

  public get(): RequestPromise {
    return this.getAll()
  }

  public getByName(name: string): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: `/properties/v1/contacts/properties/named/${name}`
    })
  }

  public create(data: ContactPropertyCreateData) {
    return this.client._request({
      method: 'POST',
      path: '/properties/v1/contacts/properties',
      body: data
    })
  }

  public update(name: string, data: ContactPropertyUpdateData) {
    return this.client._request({
      method: 'PUT',
      path: `/properties/v1/contacts/properties/named/${name}`,
      body: data
    })
  }

  public delete(name: string): RequestPromise {
    return this.client._request({
      method: 'DELETE',
      path: `/properties/v1/contacts/properties/named/${name}`
    })
  }

  public upsert(data: ContactPropertyCreateData) {
    return this.create(data).catch(err => {
      // if 409, the property already exists
      if (err.statusCode !== 409) {
        throw err
      }
      return this.update(data.name, data)
    })
  }

  public getGroups(): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/properties/v1/contacts/groups'
    })
  }

  public createGroup(data: { name: string; displayName: string; displayOrder?: number }): RequestPromise {
    return this.client._request({
      method: 'POST',
      path: '/properties/v1/contacts/groups',
      body: data
    })
  }

  public updateGroup(
    name: string,
    data: {
      displayName?: string
      displayOrder?: number
    }
  ): RequestPromise {
    return this.client._request({
      method: 'PUT',
      path: `/properties/v1/contacts/groups/named/${name}`,
      body: data
    })
  }

  public deleteGroup(name: string): RequestPromise {
    return this.client._request({
      method: 'DELETE',
      path: `/properties/v1/contacts/groups/named/${name}`
    })
  }
}
