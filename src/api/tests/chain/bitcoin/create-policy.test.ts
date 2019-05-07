import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import { currency } from '../../helpers'
import { constants } from 'sakiewka-crypto'
// @ts-ignore
const { policy } = app.sakiewkaApi[currency]

// @ts-ignore
const mockFn = jest.fn(() => {
  return new Promise((resolve: Function) => {
    resolve('new policy')
  })
})

policy.createPolicy = mockFn

describe(`/${currency}/policy`, () => {
  it('should exist', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/${currency}/policy`)

    expect(response.status).to.not.be.equal(404)
  })

  it('should not accept request with missing header', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/${currency}/policy`)

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('Request header Authorization is required.')
  })

  it('should pass proper arguments to createPolicy and return result of its call', async () => {
    const token = 'testToken'
    const policySettings = {
      kind: 'whitelist',
      addresses: ['0x1', '0x2']
    };
    const newPolicy = {
      name: 'ps1',
      policySettings
    };
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/${currency}/policy`)
      .set('Authorization', `Bearer ${token}`)
      .send(newPolicy)

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('new policy')
    expect(callArgs[0]).to.eq(`Bearer ${token}`)
    expect(callArgs[1]).to.eq('ps1')
    expect(callArgs[2]).to.eql(policySettings)
  })
})
