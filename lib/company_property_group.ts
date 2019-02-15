import { RequestPromise } from 'request-promise'

export interface CompanyPropertyGroupCreateData {
  name: string
  displayName: string
  displayOrder?: number
}

export default class CompanyPropertyGroup {
  constructor(private client) {}

  public getAll(options?: { includeProperties?: boolean }): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/properties/v1/companies/groups',
      qs: options
    })
  }

  public get(options?: { includeProperties?: boolean }): RequestPromise {
    return this.getAll(options)
  }

  public create(data: CompanyPropertyGroupCreateData) {
    return this.client._request({
      method: 'POST',
      path: '/properties/v1/companies/groups',
      body: data
    })
  }

  public update(name: string, data: { displayName?: string; displayOrder?: number }) {
    return this.client._request({
      method: 'PUT',
      path: '/properties/v1/companies/groups/named/' + name,
      body: data
    })
  }

  public upsert(data: CompanyPropertyGroupCreateData) {
    return this.create(data).catch(err => {
      // if 409, the property group already exists
      if (err.statusCode !== 409) {
        throw err
      }
      return this.update(data.name, data)
    })
  }
}
