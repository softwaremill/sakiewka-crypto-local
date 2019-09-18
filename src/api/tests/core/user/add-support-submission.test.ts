import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import { constants } from 'sakiewka-crypto'
// @ts-ignore
const { user } = app.sakiewkaApi

// @ts-ignore
const mockFn = jest.fn().mockResolvedValue('done')

user.addSupportSubmission = mockFn

describe('/user/support', () => {
  it('should exist', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/support`)

    expect(response.status).to.not.equal(404)
  })

  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/support`)

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('"subject" is required')
  })

  it('should not accept extra parameters', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/support`)
      .send({
        subject: 'abcd',
        content: 'abcd',
        extraProp: 123
      })

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('"extraProp" is not allowed')
  })

  it('should return 200 ok', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/user/support`)
      .set('Authorization', 'testToken')
      .send({
        subject: 'subject',
        content: 'content'
      })

    const callArgs = mockFn.mock.calls[0]
    expect(response.status).to.be.equal(200)
    expect(callArgs[0]).to.eq('testToken')
    expect(callArgs[1]).to.eq('subject')
    expect(callArgs[2]).to.eq('content')
  })
})
