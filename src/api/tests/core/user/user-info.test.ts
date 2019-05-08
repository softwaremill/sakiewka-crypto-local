import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import { constants } from 'sakiewka-crypto'
// @ts-ignore
const { user } = app.sakiewkaApi

// @ts-ignore
const mockFn = jest.fn(() => {
  return Promise.resolve('info')
})

user.info = mockFn

describe('/user/info', () => {
  it('should not accept request with missing header', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/user/info`)

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('Request header Authorization is required.')
  })

  it('should fetch user info', async () => {
    const token = 'testToken'

    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/user/info`)
      .set('Authorization', `Bearer ${token}`)

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('info')
    expect(callArgs[0]).to.eq(`Bearer ${token}`)
  })
})
