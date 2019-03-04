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
      .post(`/${constants.BASE_API_PATH}/btc/wallet/123/utxo`)

    expect(response.status).to.not.equal(404)
  })

  it('should not accept request with missing body params', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/btc/wallet/123/utxo`)

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('"feeRateSatoshi" is required')
  })

  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/btc/wallet/123/utxo`)
      .send({
        feeRateSatoshi: '12',
        recipients: [{ address: '0x0', amount: '123' }]
      })

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('Request header Authorization is required.')
  })

  it('should return list of unspents', async () => {
    const token = 'testToken'

    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/btc/wallet/1233/utxo`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        feeRateSatoshi: '12',
        recipients: [{ address: '0x0', amount: '123' }]
      })

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('test wallet')
    expect(callArgs[0]).to.eq(`Bearer ${token}`)
    expect(callArgs[1]).to.eq('1233')
    expect(callArgs[2]).to.eq('12')
    expect(callArgs[3][0].address).to.eq('0x0')
    expect(callArgs[3][0].amount.toString()).to.eq('123')
  })
})
