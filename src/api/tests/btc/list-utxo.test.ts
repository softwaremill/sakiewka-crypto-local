import { expect } from 'chai'
import app from '../../app'
import supertest from 'supertest'

import sakiewkaCrypto from 'sakiewka-crypto'
const { constants, wallet } = sakiewkaCrypto

// @ts-ignore
const mockFn = jest.fn(() => {
  return new Promise((resolve: Function) => {
    resolve('test wallet')
  })
})

wallet.listUnspents = mockFn

describe('/btc/wallet/utxo', () => {
  it('should exist', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/btc/wallet/123/utxo`)

    expect(response.status).to.not.equal(404)
  })

  it('should not accept request with missing query params', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/btc/wallet/123/utxo`)

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('"amountBtc" is required')
  })

  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/btc/wallet/123/utxo?amountBtc=123&feeRateSatoshi=12`)

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('Request header Authorization is required.')
  })

  it('should return list of unspents', async () => {
    const token = 'testToken'

    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/btc/wallet/1233/utxo?amountBtc=123&feeRateSatoshi=12`)
      .set('Authorization', `Bearer ${token}`)

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('test wallet')
    expect(callArgs[0]).to.eq(`Bearer ${token}`)
    expect(callArgs[1]).to.eq('1233')
    expect(callArgs[2].toNumber()).to.eq(123)
    expect(callArgs[3]).to.eq('12')
  })
})
