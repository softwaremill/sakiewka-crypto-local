import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import { currency } from '../../helpers'
import { constants } from 'sakiewka-crypto'
// @ts-ignore
const { address } = app.sakiewkaApi[currency]

// @ts-ignore
const mockFn = jest.fn(() => {
  return Promise.resolve('test address')
})

address.getAddress = mockFn

describe(`/${currency}/wallet/:walletId/address/:address`, () => {
  it('should exist', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet/12/address/abcd`)

    expect(response.status).to.not.be.equal(404)
  })

  it('should not accept request with missing header', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet/12/address/abcd`)

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('Request header Authorization is required.')
  })

  it('should return address data', async () => {
    const token = 'testToken'
    const walletId = 'testWalletId'
    const address = 'testAddress'

    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet/${walletId}/address/${address}`)
      .set('Authorization', `Bearer ${token}`)

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('test address')
    expect(callArgs[0]).to.eq(`Bearer ${token}`)
    expect(callArgs[1]).to.eq(walletId)
    expect(callArgs[2]).to.eq(address)
  })
})
