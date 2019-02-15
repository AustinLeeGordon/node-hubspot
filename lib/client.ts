import * as _ from 'lodash'
import { RequestPromise } from 'request-promise'
import Broadcast from './broadcast'
import Campaign from './campaign'
import Company from './company'
import Contact from './contact'
import Deal from './deal'
import Email from './emails'
import Engagement from './engagement'
import File from './file'
import List from './list'
import OAuth from './oauth'
import Owner from './owner'
import Page from './page'
import Pipeline from './pipeline'
import Subscription from './subscription'
import Timeline from './timeline'
import { LimitError } from './types'
import Workflow from './workflow'
const request = require('request-promise')
const EventEmitter = require('events').EventEmitter
const Bottleneck = require('bottleneck')

const debug = require('debug')('hubspot:client')

export interface HubspotOptions {
  maxUsePercent?: number
  baseUrl?: string
  timeout?: number
  checkLimit?: boolean
  limiter?: {}
  clientId?: string
  clientSecret?: string
  redirectUri?: string
  refreshToken?: string
  apiKey?: string
  accessToken?: string
  useOAuth1?: boolean
}

const defaultOptions = {
  maxUsePercent: 90,
  baseUrl: 'http://api.hubapi.com',
  timeout: 15000,
  checkLimit: true,
  limiter: {
    maxConcurrent: 2,
    minTime: 1000 / 9
  }
}

export default class Hubspot extends EventEmitter {
  public static apiCalls = 0

  public broadcasts = new Broadcast(this)
  public campaigns = new Campaign(this)
  public companies = new Company(this)
  public contacts = new Contact(this)
  public pages = new Page(this)
  public deals = new Deal(this)
  public emails = new Email(this)
  public engagements = new Engagement(this)
  public files = new File(this)
  public lists = new List(this)
  public oauth = new OAuth(this)
  public owners = new Owner(this)
  public pipelines = new Pipeline(this)
  public timelines = new Timeline(this)
  public subscriptions = new Subscription(this)
  public workflows = new Workflow(this)
  constructor(options: HubspotOptions = defaultOptions) {
    super()
    this.qs = {}
    this.init(options)
    this.on('apiCall', params => {
      debug('apiCall', _.pick(params, ['method', 'url']))
      this.apiCalls += 1
    })
  }

  public requestStats(): {} {
    return {
      running: this.limiter.running(),
      queued: this.limiter.queued()
    }
  }

  public setAccessToken(accessToken: string): void {
    this.accessToken = accessToken
    this.auth = { bearer: accessToken }
  }

  public refreshAccessToken(): RequestPromise {
    return this.oauth.refreshAccessToken()
  }

  public getApiLimit() {
    this.limit = this.limit || {}
    const collectedAt = this.limit.collectedAt || 0
    const recencyMinutes = (Date.now() - collectedAt) / (60 * 1000)
    debug('recencyMinutes', recencyMinutes)
    if (recencyMinutes < 5) {
      return Promise.resolve(this.limit)
    }
    return this._request({
      method: 'GET',
      path: '/integrations/v1/limit/daily'
    }).then(results => {
      this.limit = results.filter(r => r.name === 'api-calls-daily')[0]
      return this.limit
    })
  }

  private init(options): void {
    let { apiKey, accessToken, useOAuth1, limiter, ...rest } = options
    if (apiKey || accessToken) {
      this.setAuth({
        apiKey,
        accessToken,
        useOAuth1
      })
    }
    if (limiter) {
      limiter = Object.assign(defaultOptions.limiter, limiter)
    }
    this.limiter = new Bottleneck(limiter)
    for (const key in rest) {
      this[key] = options[key]
    }
  }

  private setAuth(options: { apiKey: string; accessToken: string; useOAuth1: boolean }): void {
    const { apiKey, accessToken, useOAuth1 } = options
    if (apiKey) {
      this.qs.hapikey = apiKey
    } else if (accessToken) {
      if (useOAuth1) {
        this.qs.access_token = accessToken
      }
      // defaults to OAuth2
      this.setAccessToken(accessToken)
    }
  }

  private _request(options: { [x: string]: any }) {
    const params = _.cloneDeep(options)
    if (this.auth) {
      params.auth = this.auth
    }
    params.json = true
    params.resolveWithFullResponse = true

    params.url = this.baseUrl + params.path
    delete params.path
    params.qs = Object.assign({}, this.qs, params.qs)

    params.qsStringifyOptions = {
      arrayFormat: 'repeat'
    }

    params.timeout = this.apiTimeout

    return this.checkApiLimit(params).then(() => {
      this.emit('apiCall', params)
      return this.limiter.schedule(() =>
        request(params)
          .then(res => {
            this.updateApiLimit(res)
            return res
          })
          .then(res => res.body)
      ) // limit the number of concurrent requests
    })
  }

  private updateApiLimit(res): void {
    const { headers } = res
    if (this.usageLimit === undefined) {
      this.usageLimit = headers['x-hubspot-ratelimit-daily']
    }
    if (this.usageLimit !== undefined) {
      this.currentUsage = this.usageLimit - headers['x-hubspot-ratelimit-daily-remaining']
    }
  }

  private checkApiLimit(params) {
    return new Promise((resolve, reject) => {
      if (this.auth) {
        // don't check the api limit for the api call
        resolve()
      }
      if (/integrations\/v1\/limit|oauth/.test(params.url)) {
        // don't check the api limit for the api call
        resolve()
      }
      if (!this.checkLimit) {
        // don't check the api limit for the api call
        resolve()
      }
      if (this.maxUsePercent === 0) {
        // if maxUsePercent set to 0, do not check for the API limit (use at your own risk)
        resolve()
      }
      if (this.currentUsage !== undefined) {
        const usagePercent = (100.0 * this.currentUsage) / this.usageLimit
        debug('usagePercent', usagePercent, 'apiCalls', this.apiCalls)
        if (usagePercent > this.maxUsePercent) {
          const err: LimitError = new LimitError('Too close to the API limit')
          err.usageLimit = this.usageLimit
          err.currentUsage = this.currentUsage
          err.usagePercent = usagePercent
          reject(err)
        }
      }
      resolve()
    })
  }
}
