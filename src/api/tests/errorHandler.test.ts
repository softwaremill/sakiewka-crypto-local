import app from '../app'
import supertest from 'supertest'
import { constants } from 'sakiewka-crypto'
// @ts-ignore
const { user } = app.sakiewkaApi

const chai = require('chai')
chai.use(require('chai-uuid'))
const expect = chai.expect

declare var jest: any

// @ts-ignore
user.login = jest.fn(() => {
  throw new Error('Failed to login a user')
})

describe('server', () => {
  it('should contain error uuid as id on error', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/login`)
      .send({
        login: 'testLogin',
        password: 'testPassword'
      })

    expect(response.status).to.be.equal(500)
    expect(response.body).to.haveOwnProperty('errorId')
    expect(response.body.errorId).to.be.a.uuid()
  })
})
