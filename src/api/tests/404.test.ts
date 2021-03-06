import { expect } from 'chai'
import app from '../app'
import supertest from 'supertest'

import { constants } from 'sakiewka-crypto'

describe('404', () => {
  it('should properly handle wrong path', async () => {
    const response = await supertest(app).get('/some-route')
    expect(response.status).to.be.equal(404)
    expect(response.body.errors[0].message).to.eq('Not found')
  })

  it('should properly handle wrong method', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/btc/user/register`)
    expect(response.body.errors[0].message).to.eq('Not found')
  })

  it('should properly handle post req to wrong url', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/btc/address/creat`)

    expect(response.body.errors[0].message).to.eq('Not found')
  })
})
