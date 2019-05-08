import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import { currency } from '../../helpers'
import { constants } from 'sakiewka-crypto'
// @ts-ignore
const { webhooks } = app.sakiewkaApi[currency]

// @ts-ignore
const mockFn = jest.fn(() => {
  return Promise.resolve('test webhook')
})

webhooks.createWebhook = mockFn

describe(`/${currency}/wallet/walletId/webhooks`, () => {
  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/${currency}/wallet/testWallet123/webhooks`)
      .set('Authorization', 'Bearer abc')

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('"callbackUrl" is required')
  })

  it('should not accept extra parameters', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/${currency}/wallet/testwallet123/webhooks`)
      .set('Authorization', 'Bearer abc')
      .send({
        callbackUrl: 'http://test.callbackurl.com',
        settings: {
          type: 'transfer',
          confirmations: 6
        },
        extraProperty: 'You should not expect me here'
      })

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('"extraProperty" is not allowed')
  })

  it('should create webhook', async () => {
    const token = 'testToken'
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/${currency}/wallet/testwallet123/webhooks`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        callbackUrl: 'http://test.callbackurl.com',
        settings: {
          type: 'transfer',
          confirmations: 6
        }
      })

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('test webhook')
    expect(callArgs[0]).to.eq(`Bearer ${token}`)
    expect(callArgs[1]).to.eq('testwallet123')
    expect(callArgs[2]).to.eq('http://test.callbackurl.com')
    expect(callArgs[3]).deep.eq({
      type: 'transfer',
      confirmations: 6
    })
  })
})
