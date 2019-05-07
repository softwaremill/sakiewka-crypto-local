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

user.confirm2fa = mockFn

describe('/user/2fa/confirm', () => {
  beforeEach(() => {
    mockFn.mockClear()
  })

  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/2fa/confirm`)
      .send({ code: 123456 })

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('"password" is required')
  })

  it('should not accept extra parameters', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/2fa/confirm`)
      .send({
        password: 'abcd',
        code: 123456,
        extraProp: 123
      })

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('"extraProp" is not allowed')
  })

  it('should confirm 2fa', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/2fa/confirm`)
      .set('Authorization', 'testToken')
      .send({
        password: 'abcd',
        code: 123456
      })

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq(undefined)
    expect(callArgs[0]).to.eq('testToken')
    expect(callArgs[1]).to.eq('abcd')
    expect(callArgs[2]).to.eq(123456)
  })
})
