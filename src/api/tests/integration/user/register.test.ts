import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import { randomString } from '../helpers'
import sakiewkaCrypto from 'sakiewka-crypto'
const { constants, user, crypto } = sakiewkaCrypto

// @ts-ignore
const mockFn = jest.fn(() => {
  return new Promise((resolve: Function) => {
    resolve({ data: { response: 'response' } })
  })
})

user.register = mockFn

describe('/user/register', () => {
  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/register`)
      .send({ login: 'testLogin' })

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('"password" is required')
  })

  it('should not accept extra paramters', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/register`)
      .send({
        login: 'testLogin',
        password: 'abcd',
        extraProp: 'test'
      })

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('"extraProp" is not allowed')
  })

  it('should register user', async () => {
    const login = `testlogin${randomString()}`
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/register`)
      .send({
        login,
        password: 'abcd'
      })

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data.response).to.eq('response')
    expect(callArgs[0]).to.eq(login)
    expect(callArgs[1]).to.eq(crypto.hashPassword('abcd'))
  })
})
