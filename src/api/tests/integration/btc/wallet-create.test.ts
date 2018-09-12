import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import sakiewkaCrypto from 'sakiewka-crypto'
const { constants } = sakiewkaCrypto
import { getUser } from '../helpers'

describe('/btc/wallet/create', () => {
  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/btc/wallet/create`)
      .set('Authorization', 'Bearer abc')

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('"name" is required')
  })

  it('should not accept extra parameters', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/btc/wallet/create`)
      .set('Authorization', 'Bearer abc')
      .send({
        name: 'testLabel',
        passphrase: 'aaa',
        userPubKey: '123',
        backupPubKey: '142',
        extraProp: 'abcd'
      })

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('"extraProp" is not allowed')
  })

  it('should create wallet', async () => {
    const { token } = await getUser()

    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/btc/wallet/create`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'testLabel',
        passphrase: 'aaa',
        userPubKey: 'xpub661MyMwAqRbcEbQrpBDMTDgW5Hjg5BFxoJD2SnzTmTASPxD4i4j1xMCKojYwgaRXXBRAHB7WPECxA2aQVfL61G4mWjnHMj6BJtAQKMVAiYs',
        backupPubKey: 'xpub661MyMwAqRbcGukLdXtbs5TTqkddNUYzdWAmZ3mQTRZgtaySzU9ePfVEZWtQJBZGbfKfhPZfG74z6TXkeEx2atofMhn2n4bHLzjDWHREM5u'
      })

    expect(response.status).to.be.equal(200)
    expect(response.body.data.user.pubKey).to.eq('xpub661MyMwAqRbcEbQrpBDMTDgW5Hjg5BFxoJD2SnzTmTASPxD4i4j1xMCKojYwgaRXXBRAHB7WPECxA2aQVfL61G4mWjnHMj6BJtAQKMVAiYs')
    expect(response.body.data.backup.pubKey).to.have.lengthOf(111)
    expect(response.body.data.service.pubKey).to.have.lengthOf(111)
    expect(response.body.data.user.pubKey).to.have.lengthOf(111)
  })
})
