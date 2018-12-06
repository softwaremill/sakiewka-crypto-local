import { expect } from 'chai'
import app from '../../app'
import supertest from 'supertest'

import { randomString } from '../helpers'
import sakiewkaCrypto from 'sakiewka-crypto'
const { constants, user, crypto } = sakiewkaCrypto

// @ts-ignore
const mockFn = jest.fn(() => {
  return new Promise((resolve: Function) => {
    resolve('response')
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

  it('should not accept extra parameters', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/register`)
      .send({
        login: 'testLogin',
        password: crypto.hashPassword('abcd'),
        extraProp: 'test'
      })

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('"extraProp" is not allowed')
  })

  it('should register user', async () => {
    const login = `testlogin${randomString()}`
    const hashPassword = crypto.hashPassword('abcd')
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/register`)
      .send({
        login,
        password: hashPassword
      })

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('response')
    expect(callArgs[0]).to.eq(login)
    expect(callArgs[1]).to.eq(hashPassword)
  })

  it('should not accept invalid password', async () => {
    const login = `testlogin${randomString()}`
    const response = await supertest(app)
        .post(`/${constants.BASE_API_PATH}/user/register`)
        .send({
          login,
          password: 'invalid-password'
        })

    expect(response.status).to.be.equal(400)
    const error = response.body.error
    expect(error.message).to.eq('Invalid length of password, expected: 64, got: 16')
    expect(error.code).to.eq(400)
  })
})
