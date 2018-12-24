import { expect } from 'chai'
import app from '../../app'
import supertest from 'supertest'
import { BigNumber } from "bignumber.js";

import sakiewkaCrypto from 'sakiewka-crypto'
const { constants, transaction } = sakiewkaCrypto

// @ts-ignore
const mockFn = jest.fn(() => {
  return new Promise((resolve: Function) => {
    resolve('coins sent')
  })
})

transaction.sendCoins = mockFn

describe('/btc/wallet/walletId/send-coins', () => {
  it('should exist', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/btc/wallet/123/send-coins`)

    expect(response.status).to.not.equal(404)
  })

  it('should not accept request with missing params', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/btc/wallet/123/send-coins`)

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('"xprv" is required')
  })

  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/btc/wallet/123/send-coins`)
      .send({
        xprv: 'abc',
        recipients: []
      })

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('Request header Authorization is required.')
  })

  it('should send coins', async () => {
    const token = 'testToken'
    const recipients = [{address: 'abcd', amount: 123}]

    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/btc/wallet/123/send-coins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        recipients,
        xprv: 'abc'
      })

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('coins sent')
    expect(callArgs[0]).to.eq(`Bearer ${token}`)
    expect(callArgs[1]).to.eq('abc')
    expect(callArgs[2]).to.eq('123')
    expect(callArgs[3][0]).to.eql({address: 'abcd', amount: new BigNumber(123)})
  })
})
