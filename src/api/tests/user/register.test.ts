import { expect } from 'chai'
import app from '../../app'
import supertest from 'supertest'

import { randomString } from '../helpers'
import sakiewkaCrypto from 'sakiewka-crypto'

const { constants, user } = sakiewkaCrypto

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

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('"login" is required')
  })

  it('should not accept extra parameters', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/register`)
      .send({
        login: 'testLogin',
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
      })

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('response')
    expect(callArgs[0]).to.eq(login)
  })
})
