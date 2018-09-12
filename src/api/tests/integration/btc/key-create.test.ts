import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import sakiewkaCrypto from 'sakiewka-crypto'
const { constants } = sakiewkaCrypto

describe('/btc/key/create', () => {
  it('should not accept extra parameters', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/btc/key/create`)
      .set('Authorization', 'Bearer abc')
      .send({
        extraProp: 'test',
        passphrase: 'aaa'
      })

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('"extraProp" is not allowed')
  })

  it('should return keys', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/btc/key/create`)

    expect(response.status).to.be.equal(200)
    expect(response.body.data).to.haveOwnProperty('keyPair')
    expect(response.body.data.keyPair).to.haveOwnProperty('pubKey')
    expect(response.body.data.keyPair).to.haveOwnProperty('prvKey')
    expect(response.body.data.keyPair.pubKey).to.have.lengthOf(111)
    expect(response.body.data.keyPair.prvKey).to.have.lengthOf(111)
  })

  it('should return encrypted key', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/btc/key/create`)
      .send({
        passphrase: 'abcd'
      })

    expect(response.status).to.be.equal(200)
    expect(response.body.data).to.haveOwnProperty('keyPair')
    expect(response.body.data.keyPair).to.haveOwnProperty('pubKey')
    expect(response.body.data.keyPair).to.haveOwnProperty('prvKey')
    expect(response.body.data.keyPair.pubKey).to.have.lengthOf(111)
    expect(response.body.data.keyPair.prvKey).to.have.lengthOf(298)
  })
})
