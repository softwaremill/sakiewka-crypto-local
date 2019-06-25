import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import { constants, crypto } from 'sakiewka-crypto'
// @ts-ignore
const { user } = app.sakiewkaApi

// @ts-ignore
const mockFn = jest.fn().mockResolvedValue('test wallet')

user.createAuthToken = mockFn

describe('/btc/user/auth-token (create)', () => {
  it('should exist', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/auth-token`)

    expect(response.status).to.not.equal(404)
  })

  it('should return 200 ok', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/auth-token`)
      .set('Authorization', 'testToken')
      .send({
        duration: '1 minute'
      })

    const callArgs = mockFn.mock.calls[0]
    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('test wallet')
    expect(callArgs[0]).to.eq('testToken')
    expect(callArgs[1]).to.eq('1 minute')
  })
})
