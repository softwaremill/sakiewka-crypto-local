import { expect } from 'chai'
import app from '../../app'
import supertest from 'supertest'

import { constants } from 'sakiewka-crypto'
// @ts-ignore
const { transfers } = app.sakiewkaApi

// @ts-ignore
const mockFn = jest.fn(() => {
  return new Promise((resolve: Function) => {
    resolve('my-transfers')
  })
})

transfers.listTransfers = mockFn

describe('/transfers', () => {
  beforeEach(() => {
    mockFn.mockClear()
  })

  it('should not accept request with missing limit param', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/transfers`)
      .set('Authorization', 'testToken')

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('"limit" is required')
  })

  it('should not accept request with missing header', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/transfers?limit=20`)

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('Request header Authorization is required.')
  })

  it('should return transfers', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/transfers?limit=20`)
      .set('Authorization', 'testToken')

    expect(response.status).to.be.equal(200)
    expect(response.body.data).to.be.equal('my-transfers')
  })

  it('should return transfers for walletId', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/transfers?walletId=my-wallet&limit=20&nextPageToken=2`)
      .set('Authorization', 'testToken')

    console.log(response.body)
    const callArgs = mockFn.mock.calls[0]
    expect(response.status).to.be.equal(200)
    expect(response.body.data).to.be.equal('my-transfers')
    expect(callArgs[0]).to.eq('testToken')
    expect(callArgs[1]).to.eq('my-wallet')
    expect(callArgs[2]).to.eq('20')
    expect(callArgs[3]).to.eq('2')
  })
})
