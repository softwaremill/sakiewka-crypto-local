import { expect } from 'chai'
import app from '../../app'
import supertest from 'supertest'
import sakiewkaCrypto from 'sakiewka-crypto'

const { constants, user } = sakiewkaCrypto

// @ts-ignore
const mockFn = jest.fn(() => {
  return new Promise((resolve: Function) => {
    resolve('qrImageUrl')
  })
})

user.init2fa = mockFn

describe('/user/2fa/init', () => {
  beforeEach(() => {
    mockFn.mockClear()
  })

  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/2fa/init`)
      .send({})

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('"password" is required')
  })

  it('should not accept extra parameters', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/2fa/init`)
      .send({
        password: 'abcd',
        extraProp: 123
      })

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('"extraProp" is not allowed')
  })

  it('should init 2fa', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/2fa/init`)
      .send({
        password: 'abcd'
      })

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('qrImageUrl')
    expect(callArgs[0]).to.eq('abcd')
  })
})