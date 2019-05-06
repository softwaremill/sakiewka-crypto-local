import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'
import { currency } from '../../helpers'
import { constants } from 'sakiewka-crypto'
// @ts-ignore
const { key } = app.sakiewkaApi[currency]

// @ts-ignore
const mockFn = jest.fn(() => {
  return new Promise((resolve: Function) => {
    resolve('test address')
  })
})

key.getKey = mockFn

describe(`/${currency}/key/:id`, () => {
  it('should exist', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/key/13`)

    expect(response.status).to.not.be.equal(404)
  })

  it('should not accept request with missing header', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/key/13`)

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('Request header Authorization is required.')
  })

  it('should return key data', async () => {
    const token = 'testToken'
    const keyId = 'testKeyId'
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/key/${keyId}?includePrivate=true`)
      .set('Authorization', `Bearer ${token}`)

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('test address')
    expect(callArgs[0]).to.eq(`Bearer ${token}`)
    expect(callArgs[1]).to.eq(keyId)
    expect(callArgs[2]).to.eq('true')

    // TODO: test for working includePrivate
  })
})
