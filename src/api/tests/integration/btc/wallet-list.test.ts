import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import sakiewkaCrypto from 'sakiewka-crypto'
const { constants } = sakiewkaCrypto
import { getUser, getWalletId } from '../helpers'

describe('/btc/wallet', () => {
  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/btc/wallet`)

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('Request header Authorization is required.')
  })

  it('should return list of wallets', async () => {
    const { token } = await getUser()
    const walletId = await getWalletId(token)

    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/btc/wallet?limit=20`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).to.be.equal(200)
    expect(response.body.data).to.haveOwnProperty('wallets')
    expect(response.body.data.wallets).to.have.lengthOf(1)
    expect(response.body.data.wallets[0].name).to.eq('testName')
    expect(response.body.data.wallets[0].id).to.eq(walletId)
  })
})
