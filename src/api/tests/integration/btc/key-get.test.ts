import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import { getUser, getKeyId } from '../helpers'
import sakiewkaCrypto from 'sakiewka-crypto'
const { constants } = sakiewkaCrypto

describe('/btc/key/:id', () => {
  it('should exist', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/btc/key/13`)

    expect(response.status).to.not.be.equal(404)
  })

  it('should not accept request with missing header', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/btc/key/13`)

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('Request header Authorization is required.')
  })

  it('should return key data', async () => {
    const { token } = await getUser()
    const keyId = await getKeyId(token)
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/btc/key/${keyId}?includePrivate=true`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).to.be.equal(200)
    expect(response.body.data).to.be.haveOwnProperty('id')
    expect(response.body.data).to.be.haveOwnProperty('pubKey')
    expect(response.body.data).to.be.haveOwnProperty('keyType')
    expect(response.body.data).to.be.haveOwnProperty('created')

    // TODO: test for working includePrivate
  })
})
