import { expect } from 'chai'
import app from '../../app'
import supertest from 'supertest'

import sakiewkaCrypto from 'sakiewka-crypto'
import { currency } from '../helpers'
const { constants } = sakiewkaCrypto
const { wallet } = sakiewkaCrypto[currency]

// @ts-ignore
const mockFn = jest.fn(() => {
  return new Promise((resolve: Function) => {
    resolve('test wallet')
  })
})

wallet.getWallet = mockFn

describe(`/${currency}/wallet/id`, () => {
  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet/1234`)

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('Request header Authorization is required.')
  })

  it('should get wallet', async () => {
    const token = 'testToken'
    const walletId = 'testWalletId'

    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet/${walletId}`)
      .set('Authorization', `Bearer ${token}`)

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('test wallet')
    expect(callArgs[0]).to.eq(`Bearer ${token}`)
    expect(callArgs[1]).to.eq(walletId)
  })
})
