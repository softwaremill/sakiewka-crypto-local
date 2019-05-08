import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import { currency } from '../../helpers'
import { constants } from 'sakiewka-crypto'
// @ts-ignore
const { address } = app.sakiewkaApi[currency]

// @ts-ignore
const mockFn = jest.fn().mockResolvedValue('test addresses')

address.listAddresses = mockFn

describe(`/${currency}/wallet/:walletId/address/`, () => {
  it('should exist', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet/12/address`)

    expect(response.status).to.not.be.equal(404)
  })

  it('should not accept request with missing header', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet/12/address?limit=10`)

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('Request header Authorization is required.')
  })

  it('should not accept request with missing query params', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet/12/address`)

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('"limit" is required')
  })

  it('should return addresses data', async () => {
    const token = 'testToken'
    const walletId = 'testWalletId'

    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet/${walletId}/address?limit=20&nextPageToken=abbbb`)
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
