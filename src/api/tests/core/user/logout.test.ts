import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'
import { constants } from 'sakiewka-crypto'
// @ts-ignore
const { user } = app.sakiewkaApi

// @ts-ignore
const mockFn = jest.fn(() => {
  return new Promise((resolve: Function) => {
    resolve()
  })
})

user.logout = mockFn

describe('/user/logout', () => {
  it('should exist', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/logout`)

    expect(response.status).to.not.be.equal(404)
  })

  it('should not accept request with missing header', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/logout`)

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('Request header Authorization is required.')
  })

  it('should logout', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/logout`)
      .set('Authorization', 'testToken')

    expect(response.status).to.be.equal(200)
  })
})
