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

wallet.listWallets = mockFn

describe(`/${currency}/wallet`, () => {
  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet?limit=30`)

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('Request header Authorization is required.')
  })

  it('should not accept request with missing query params', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet`)

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('"limit" is required')
  })

  it('should return list of wallets', async () => {
    const token = 'testToken'

    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet?limit=20`)
      .set('Authorization', `Bearer ${token}`)

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('test wallet')
    expect(callArgs[0]).to.eq(`Bearer ${token}`)
    expect(callArgs[1]).to.eq('20')
    expect(callArgs[2]).to.eq(undefined)
  })
})
