import { expect } from 'chai'
import app from '../../app'
import supertest from 'supertest'

import sakiewkaCrypto from 'sakiewka-crypto'
const { constants, transfers } = sakiewkaCrypto

// @ts-ignore
const mockFn = jest.fn(() => {
  return new Promise((resolve: Function) => {
    resolve('summary')
  })
})

transfers.monthlySummary = mockFn

describe('/transfers/monthly-summary', () => {
  it('should not accept request with missing header', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/transfers/monthly-summary/4/2019/USD`)

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('Request header Authorization is required.')
  })

  it ('should not accept request with missing month', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/transfers/monthly-summary/2019/USD`)

    expect(response.status).to.be.equal(404)
  })

  it ('should not accept request with missing year', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/transfers/monthly-summary/4/USD`)

    expect(response.status).to.be.equal(404)
  })

  it ('should not accept request with missing fiat currency', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/transfers/monthly-summary/4/2019`)

    expect(response.status).to.be.equal(404)
  })

  it('should return monthly summary', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/transfers/monthly-summary/4/2019/USD`)
      .set('Authorization', 'testToken')

    expect(response.status).to.be.equal(200)
    expect(response.body.data).to.be.equal('summary')
  })
})
