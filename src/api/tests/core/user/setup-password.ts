import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import { constants, crypto } from 'sakiewka-crypto'
// @ts-ignore
const { user } = app.sakiewkaApi

// @ts-ignore
const mockFn = jest.fn(() => {
  return new Promise((resolve: Function) => {
    resolve('test wallet')
  })
})

user.verifyEmail = mockFn

describe('/btc/user/setup-password', () => {
  it('should exist', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/setup-password`)

    expect(response.status).to.not.equal(404)
  })

  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/setup-password`)

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('"password" is required')
  })

  it('should not accept extra parameters', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/setup-password`)
      .send({
        password: 'abcd',
        extraProp: 123
      })

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('"extraProp" is not allowed')
  })

  it('should return 200 ok', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/setup-password`)
      .set('Authorization', 'testToken')
      .send({
        password: "qweqwe"
      })

    const callArgs = mockFn.mock.calls[0]
    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('test wallet')
    expect(callArgs[0]).to.eq('testToken')
    expect(callArgs[1]).to.eq(crypto.hashPassword("qweqwe"))
  })
})
