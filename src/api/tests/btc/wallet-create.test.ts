import { expect } from 'chai'
import app from '../../app'
import supertest from 'supertest'

import sakiewkaCrypto from 'sakiewka-crypto'
const { constants, wallet } = sakiewkaCrypto

// @ts-ignore
const mockFn = jest.fn(() => {
  return new Promise((resolve: Function) => {
    resolve('test wallet')
  })
})

wallet.createWallet = mockFn

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
    const token = 'testToken'
    const userPubKey = 'xpub661MyMwAqRbcEbQrpBDMTDgW5Hjg5BFxoJD2SnzTmTASPxD4i4j1xMCKojYwgaRXXBRAHB7WPECxA2aQVfL61G4mWjnHMj6BJtAQKMVAiYs'
    const backupPubKey = 'xpub661MyMwAqRbcGukLdXtbs5TTqkddNUYzdWAmZ3mQTRZgtaySzU9ePfVEZWtQJBZGbfKfhPZfG74z6TXkeEx2atofMhn2n4bHLzjDWHREM5u'

    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/btc/wallet/create`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userPubKey,
        backupPubKey,
        name: 'testLabel',
        passphrase: 'aaa'
      })

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('test wallet')
    expect(callArgs[0]).to.eq(`Bearer ${token}`)
    expect(callArgs[1].passphrase).to.eq('aaa')
    expect(callArgs[1].userPubKey).to.eq(userPubKey)
    expect(callArgs[1].backupPubKey).to.eq(backupPubKey)
    expect(callArgs[1].name).to.eq('testLabel')
  })
})
