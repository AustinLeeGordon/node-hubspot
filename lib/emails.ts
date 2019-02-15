import { RequestPromise } from 'request-promise'

export default class Email {
  constructor(private client) {}

  public sendTransactionalEmail(data: {
    emailId: number
    message: {
      to: string
      from?: string
      sendId?: number // TODO: check on this
      replyTo?: string
      replyToList?: string[]
      cc?: string[]
      bcc?: string[]
    }
  }): RequestPromise {
    return this.client._request({
      method: 'POST',
      path: '/email/public/v1/singleEmail/send',
      body: data
    })
  }
}
