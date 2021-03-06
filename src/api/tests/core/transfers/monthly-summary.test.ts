import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import { constants } from 'sakiewka-crypto'
// @ts-ignore
const { transfers } = app.sakiewkaApi

// @ts-ignore
const mockFn = jest.fn().mockResolvedValue('summary')

transfers.monthlySummary = mockFn

describe('/transfer/monthly-summary', () => {
  it('should not accept request with missing header', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/transfer/monthly-summary/4/2019/USD`)

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('Request header Authorization is required.')
  })

  it('should not accept request with missing month', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/transfer/monthly-summary/2019/USD`)

    expect(response.status).to.be.equal(404)
  })

  it('should not accept request with missing year', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/transfer/monthly-summary/4/USD`)

    expect(response.status).to.be.equal(404)
  })

  it('should not accept request with missing fiat currency', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/transfer/monthly-summary/4/2019`)

    expect(response.status).to.be.equal(404)
  })

  it('should return monthly summary', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/transfer/monthly-summary/4/2019/USD`)
      .set('Authorization', 'testToken')

    expect(response.status).to.be.equal(200)
    expect(response.body.data).to.be.equal('summary')
  })
})
