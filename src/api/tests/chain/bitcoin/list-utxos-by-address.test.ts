import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import { constants } from 'sakiewka-crypto'
import { currency } from '../../helpers'
// @ts-ignore
const { wallet } = app.sakiewkaApi[currency]

// @ts-ignore
const mockFn = jest.fn().mockResolvedValue('my-utxos')

wallet.listUtxosByAddress = mockFn

describe(`/${currency}/wallet/:id/:address/utxo`, () => {
  beforeEach(() => {
    mockFn.mockClear()
  })

  it('should not accept request with missing limit param', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet/12/my-address/utxo`)
      .set('Authorization', 'testToken')

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('"limit" is required')
  })

  it('should not accept request with missing header', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet/12/my-address/utxo?limit=20`)

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('Request header Authorization is required.')
  })

  it('should return utxos', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet/12/my-address/utxo?limit=20&nextPageToken=nextpagetoken`)
      .set('Authorization', 'testToken')

    expect(response.status).to.be.equal(200)
    expect(response.body.data).to.be.equal('my-utxos')
    const callArgs = mockFn.mock.calls[0]
    expect(callArgs[0]).to.eq('testToken')
    expect(callArgs[1]).to.eq('12')
    expect(callArgs[2]).to.eq('my-address')
    expect(callArgs[3]).to.eq('20')
    expect(callArgs[4]).to.eq('nextpagetoken')
  })
})
