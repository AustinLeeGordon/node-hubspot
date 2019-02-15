import { RequestPromise } from 'request-promise'

export default class DealPropertyGroup {
  constructor(private client) {}

  public getAll(options?: { includeProperties?: true }): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: '/properties/v1/deals/groups',
      qs: options
    })
  }

  public get(options?: { includeProperties?: true }): RequestPromise {
    return this.getAll(options)
  }

  public create(data: {}) {
    // TODO: Fix me
    return this.client._request({
      method: 'POST',
      path: '/properties/v1/deals/groups',
      body: data
    })
  }

  public update(name: string, data: {}): RequestPromise {
    return this.client._request({
      method: 'PUT',
      path: `/properties/v1/deals/groups/named/${name}`,
      body: data
    })
  }

  public upsert(data) {
    return this.create(data).catch(err => {
      // if 409, the property group already exists
      if (err.statusCode !== 409) {
        throw err
      }
      return this.update(data.name, data)
    })
  }
}
