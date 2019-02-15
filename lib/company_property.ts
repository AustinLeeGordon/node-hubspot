import { RequestPromise } from 'request-promise'
import CompanyPropertyGroup from './company_property_group'
import { PropertyFieldType, PropertyType } from './types'

export interface CompanyPropertyBaseData {
  description?: string
  options?: string[]
  displayOrder?: number
}

export interface CompanyPropertyCreateData extends CompanyPropertyBaseData {
  name: string
  label: string
  groupName: string
  type: PropertyType
  fieldType: PropertyFieldType
}

export interface CompanyPropertyUpdateData extends CompanyPropertyBaseData {
  name?: string
  label?: string
  groupName?: string
  type?: PropertyType
  fieldType?: PropertyFieldType
}

export default class CompanyProperty {
  public groups = new CompanyPropertyGroup(this.client)
  constructor(private client) {}

  public getAll(): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/properties/v1/companies/properties'
    })
  }

  public get(): RequestPromise {
    return this.getAll()
  }

  public getByName(name: string): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: `/properties/v1/companies/properties/named/${name}`
    })
  }

  public create(data: CompanyPropertyCreateData) {
    return this.client._request({
      method: 'POST',
      path: '/properties/v1/companies/properties',
      body: data
    })
  }

  public update(name: string, data: CompanyPropertyUpdateData) {
    return this.client._request({
      method: 'PUT',
      path: `/properties/v1/companies/properties/named/${name}`,
      body: data
    })
  }

  public upsert(data: CompanyPropertyCreateData) {
    return this.create(data).catch(err => {
      // if 409, the property already exists
      if (err.statusCode !== 409) {
        throw err
      }
      return this.update(data.name, data)
    })
  }
}
