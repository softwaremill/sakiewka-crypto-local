import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import { currency } from '../../helpers'
import { constants } from 'sakiewka-crypto'
// @ts-ignore
const { wallet } = app.sakiewkaApi[currency]

// @ts-ignore
const mockFn = jest.fn(() => {
  return new Promise((resolve: Function) => {
    resolve('test wallet')
  })
})

wallet.maxTransferAmount = mockFn

describe(`/${currency}/wallet/max-transfer-amount`, () => {
  it('should exist', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet/123/max-transfer-amount`)

    expect(response.status).to.not.equal(404)
  })

  it('should not accept request with missing body params', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet/123/max-transfer-amount`)

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('"feeRate" is required')
  })

  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet/123/max-transfer-amount?recipient=0x0&feeRate=12`)

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('Request header Authorization is required.')
  })

  it('should return list of unspents', async () => {
    const token = 'testToken'

    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet/1233/max-transfer-amount?recipient=0x0&feeRate=12`)
      .set('Authorization', `Bearer ${token}`)

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('test wallet')
    expect(callArgs[0]).to.eq(`Bearer ${token}`)
    expect(callArgs[1]).to.eq('1233')
    expect(callArgs[2]).to.eq('12')
    expect(callArgs[3]).to.eq('0x0')
  })
})
