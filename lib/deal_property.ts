import { RequestPromise } from 'request-promise'
import DealPropertyGroup from './deal_property_group'

export default class DealProperty {
  public groups = new DealPropertyGroup(this.client)
  constructor(private client) {}

  public getAll(): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/properties/v1/deals/properties'
    })
  }

  public get(): RequestPromise {
    return this.getAll()
  }

  public getByName(name: string): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: `/properties/v1/deals/properties/named/${name}`
    })
  }

  public create(data: {}) {
    return this.client._request({
      method: 'POST',
      path: '/properties/v1/deals/properties',
      body: data
    })
  }

  public update(name: string, data: {}): RequestPromise {
    return this.client._request({
      method: 'PUT',
      path: `/properties/v1/deals/properties/named/${name}`,
      body: data
    })
  }

  public delete(name: string): RequestPromise {
    return this.client._request({
      method: 'DELETE',
      path: `/properties/v1/deals/properties/named/${name}`
    })
  }

  public upsert(data: { name: string; [x: string]: any }) {
    return this.create(data).catch(err => {
      // if 409, the property already exists
      if (err.statusCode !== 409) {
        throw err
      }
      return this.update(data.name, data)
    })
  }
}
