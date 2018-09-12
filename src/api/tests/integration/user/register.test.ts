import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import { randomString } from '../helpers'
import sakiewkaCrypto from 'sakiewka-crypto'
const { constants } = sakiewkaCrypto

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
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/register`)
      .send({
        login: `testlogin${randomString()}`,
        password: 'abcd'
      })

    expect(response.status).to.be.equal(200)
    expect(response.body.data).to.be.empty
  })
})
