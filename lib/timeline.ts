import { RequestPromise } from 'request-promise'
import guid from './utils/guid'

export default class Timeline {
  constructor(private client) {}

  public createEventType(
    applicationId: number | string,
    userId: number,
    data: {
      applicationId?: number | string
      name: string
      headerTemplate?: string
      detailTemplate?: string
      objectType?: 'CONTACT' | 'COMPANY' | 'DEAL'
    }
  ): RequestPromise {
    data.applicationId = data.applicationId || applicationId
    const parameters = {
      method: 'POST',
      path: `/integrations/v1/${applicationId}/timeline/event-types?userId=${userId}`,
      body: data
    }
    return this.client._request(parameters)
  }

  public updateEventType(
    applicationId: number | string,
    eventTypeId: number | string,
    data?: {
      applicationId?: number | string
      name: string
      headerTemplate: string
      detailTemplate: string
      objectType: 'CONTACT' | 'COMPANY' | 'DEAL'
    }
  ): RequestPromise {
    data.applicationId = data.applicationId || applicationId
    const parameters = {
      method: 'PUT',
      path: `/integrations/v1/${applicationId}/timeline/event-types/${eventTypeId}`,
      body: data
    }

    return this.client._request(parameters)
  }

  public createEventTypeProperty(
    applicationId: number | string,
    eventTypeId: number | string,
    userId: number | string,
    data: {
      name: string
      label: string
      propertyType: 'Date' | 'Enumeration' | 'Numeric' | 'String'
      objectProperty?: string
      options?: Array<{ [x: string]: any }>
    }
  ): RequestPromise {
    const parameters = {
      method: 'POST',
      path: `/integrations/v1/${applicationId}/timeline/event-types/${eventTypeId}/properties?userId=${userId}`,
      body: data
    }

    return this.client._request(parameters)
  }

  public updateEventTypeProperty(
    applicationId: number | string,
    eventTypeId: number | string,
    propertyId: number,
    data?: {
      propertyType: 'Date' | 'Enumeration' | 'Numeric' | 'String'
      label: string
      options?: Array<{ [x: string]: any }>
      id?: number
    }
  ): RequestPromise {
    data.id = data.id || propertyId

    return this.client._request({
      method: 'PUT',
      path: `/integrations/v1/${applicationId}/timeline/event-types/${eventTypeId}/properties`,
      body: data
    })
  }

  public createTimelineEvent(
    applicationId: number | string,
    eventTypeId: number | string,
    data?: {
      id?: string
      eventTypeId?: number | string
      objectId?: number | string
      email?: string
      utk?: string
      extraData?: {}
      timelineIFrame?: {
        linkLabel: string
        iframeLabel: string
        iframeUri: string
        width: number
        height: number
      }
      [x: string]: any
    }
  ): RequestPromise {
    if (!data.id) {
      data.id = guid()
    }

    data.eventTypeId = data.eventTypeId || eventTypeId

    return this.client._request({
      method: 'PUT',
      path: `/integrations/v1/${applicationId}/timeline/event`,
      body: data
    })
  }
}
