import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import { constants } from 'sakiewka-crypto'
// @ts-ignore
const { transfers } = app.sakiewkaApi

// @ts-ignore
const mockFn = jest.fn(() => {
  return Promise.resolve('my-transfers')
})

transfers.listTransfers = mockFn

describe('/transfer', () => {
  beforeEach(() => {
    mockFn.mockClear()
  })

  it('should not accept request with missing limit param', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/transfer`)
      .set('Authorization', 'testToken')

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('"limit" is required')
  })

  it('should not accept request with missing header', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/transfer?limit=20`)

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('Request header Authorization is required.')
  })

  it('should return transfers', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/transfer?limit=20`)
      .set('Authorization', 'testToken')

    expect(response.status).to.be.equal(200)
    expect(response.body.data).to.be.equal('my-transfers')
  })
})
