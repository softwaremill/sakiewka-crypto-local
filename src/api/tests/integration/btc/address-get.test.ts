import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import { getUser, getWalletId, getAddress } from '../helpers'
import sakiewkaCrypto from 'sakiewka-crypto'
const { constants } = sakiewkaCrypto

describe('/btc/wallet/:walletId/address/:address', () => {
  it('should exist', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/btc/wallet/12/address/abcd`)

    expect(response.status).to.not.be.equal(404)
  })

  it('should not accept request with missing header', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/btc/wallet/12/address/abcd`)

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('Request header Authorization is required.')
  })

  it('should return address data', async () => {
    const { token } = await getUser()
    const walletId = await getWalletId(token)
    const address = await getAddress(token, walletId)

    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/btc/wallet/${walletId}/address/${address}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.haveOwnProperty('path')
    expect(data).to.haveOwnProperty('address')
    expect(data).to.haveOwnProperty('created')
    expect(data.address).to.have.lengthOf(34)
    expect(data.created).to.have.lengthOf(24)
    expect(data.path.cosignerIndex).to.be.lessThan(3)
    expect(data.path.addressIndex).to.eq(1)
    expect(data.path.change).to.eq(0)
  })
})
