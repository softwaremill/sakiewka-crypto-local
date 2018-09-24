import { expect } from 'chai'
import app from '../../app'
import supertest from 'supertest'

import sakiewkaCrypto from 'sakiewka-crypto'
const { constants, address } = sakiewkaCrypto

// @ts-ignore
const mockFn = jest.fn(() => {
  return new Promise((resolve: Function) => {
    resolve('test addresses')
  })
})

address.listAddresses = mockFn

describe('/btc/wallet/:walletId/address/', () => {
  it('should exist', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/btc/wallet/12/address`)

    expect(response.status).to.not.be.equal(404)
  })

  it('should not accept request with missing header', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/btc/wallet/12/address`)

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('Request header Authorization is required.')
  })

  it('should return addresses data', async () => {
    const token = 'testToken'
    const walletId = 'testWalletId'

    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/btc/wallet/${walletId}/address?limit=20&nextPageToken=abbbb`)
      .set('Authorization', `Bearer ${token}`)

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('test addresses')
    expect(callArgs[0]).to.eq(`Bearer ${token}`)
    expect(callArgs[1]).to.eq(walletId)
    expect(callArgs[2]).to.eq('20')
    expect(callArgs[3]).to.eq('abbbb')
  })
})
