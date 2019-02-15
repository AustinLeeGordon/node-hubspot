export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type EmailEventType =
  | 'SENT'
  | 'DROPPED'
  | 'PROCESSED'
  | 'DELIVERED'
  | 'DEFERRED'
  | 'BOUNCE'
  | 'OPEN'
  | 'CLICK'
  | 'PRINT'
  | 'FORWARD'
  | 'STATUSCHANGE'
  | 'SPAMREPORT'

export declare class LimitError extends Error {
  public message: string
  public name: string
  public stack: string
  public usageLimit: number
  public currentUsage: number
  public usagePercent: number
  constructor(message?: string)
}

export type PropertyType = 'string' | 'number' | 'date' | 'datetime' | 'enumeration'
export type PropertyFieldType =
  | 'textarea'
  | 'text'
  | 'date'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'booleancheckbox'
