import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import sakiewkaCrypto from 'sakiewka-crypto'
const { constants } = sakiewkaCrypto
import { getUser, getWalletId } from '../helpers'

describe('/btc/wallet/id', () => {
  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/btc/wallet/1234`)

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('Request header Authorization is required.')
  })

  it('should get wallet', async () => {
    const { token } = await getUser()
    const walletId = await getWalletId(token)

    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/btc/wallet/${walletId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).to.be.equal(200)
    expect(response.body.data).to.haveOwnProperty('id')
    expect(response.body.data).to.haveOwnProperty('name')
    expect(response.body.data).to.haveOwnProperty('currency')
    expect(response.body.data).to.haveOwnProperty('created')
    expect(response.body.data.id).to.equal(walletId)
    expect(response.body.data.name).to.equal('testName')
    expect(response.body.data.currency).to.equal('BTC')
  })
})
