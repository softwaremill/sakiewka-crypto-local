import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import { randomString } from '../helpers'
import sakiewkaCrypto from 'sakiewka-crypto'
const { constants } = sakiewkaCrypto

describe('/user/login', () => {
  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/login`)
      .send({ login: 'testLogin' })

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('"password" is required')
  })

  it('should not accept extra paramters', async () => {
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

    expect(response.status).to.be.equal(200)
    expect(response.body.data.token).to.be.a('string')
    expect(response.body.data.token).to.have.lengthOf(64)
  })
  })