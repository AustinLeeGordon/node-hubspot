import { RequestPromise } from 'request-promise'

export default class File {
  constructor(private client) {}

  public get(id: number): RequestPromise {
    return this.client._request({
      method: 'GET',
      path: `/filemanager/api/v2/files/${id}`
    })
  }
}
