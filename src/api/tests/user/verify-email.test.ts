import { expect } from 'chai'
import app from '../../app'
import supertest from 'supertest'

import sakiewkaCrypto from 'sakiewka-crypto'
const { constants, user } = sakiewkaCrypto

// @ts-ignore
const mockFn = jest.fn(() => {
  return new Promise((resolve: Function) => {
    resolve('test wallet')
  })
})

user.verifyEmail = mockFn

describe('/btc/user/verify-email', () => {
  it('should exist', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/user/verify-email`)

    expect(response.status).to.not.equal(404)
  })

  it('should not accept request with missing query params', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/user/verify-email`)

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('"code" is required')
  })

  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/user/verify-email?code=123`)

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('"email" is required')
  })

  it('should return 200 ok', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/user/verify-email?code=123&email=testEmail`)

    const callArgs = mockFn.mock.calls[0]
    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('test wallet')
    expect(callArgs[0]).to.eq('123')
    expect(callArgs[1]).to.eq('testEmail')
  })
})
