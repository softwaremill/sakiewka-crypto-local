import { expect } from 'chai'
import app from '../../app'
import supertest from 'supertest'

import { currency } from '../helpers'
import { constants } from 'sakiewka-crypto'
// @ts-ignore
const { policy } = app.sakiewkaApi[currency]

// @ts-ignore
const mockFn = jest.fn(() => {
  return new Promise((resolve: Function) => {
    resolve('test policy')
  })
})

policy.listPolicies = mockFn

describe(`/${currency}/policy`, () => {
  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/policy?limit=30`)

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('Request header Authorization is required.')
  })

  it('should not accept request with missing query params', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/policy`)

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('"limit" is required')
  })

  it('should return list of policy', async () => {
    const token = 'testToken'

    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/policy?limit=20`)
      .set('Authorization', `Bearer ${token}`)

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('test policy')
    expect(callArgs[0]).to.eq(`Bearer ${token}`)
    expect(callArgs[1]).to.eq('20')
    expect(callArgs[2]).to.eq(undefined)
  })
})
