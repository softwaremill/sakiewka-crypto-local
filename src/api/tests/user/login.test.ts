import { expect } from 'chai'
import app from '../../app'
import supertest from 'supertest'

import { randomString } from '../helpers'
import sakiewkaCrypto from 'sakiewka-crypto'

const { constants, user } = sakiewkaCrypto

// @ts-ignore
const mockFn = jest.fn(() => {
  return new Promise((resolve: Function) => {
    resolve('token')
  })
})

user.login = mockFn

describe('/user/login', () => {
  beforeEach(() => {
    mockFn.mockClear()
  })

  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/login`)
      .send({ login: 'testLogin' })

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('"password" is required')
  })

  it('should not accept extra parameters', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/login`)
      .send({
        login: 'testLogin',
        password: 'abcd',
        extraProp: 'test'
      })

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('"extraProp" is not allowed')
  })

  it('should login user', async () => {
    const login = `testlogin${randomString()}`

    // first registers new user
    await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/register`)
      .send({
        login,
        password: 'abcd'
      })

    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/login`)
      .send({
        login,
        password: 'abcd'
      })

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('token')
    expect(callArgs[0]).to.eq(login)
    expect(callArgs[1]).to.eq('abcd')
  })

  it('should accept 2fa code and login user', async () => {
    const login = `testlogin${randomString()}`

    // first registers new user
    await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/register`)
      .send({
        login,
        password: 'abcd'
      })

    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/login`)
      .send({
        login,
        password: 'abcd',
        code: 123456
      })

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('token')
    expect(callArgs[0]).to.eq(login)
    expect(callArgs[1]).to.eq('abcd')
    expect(callArgs[2]).to.eq(123456)
  })
})
