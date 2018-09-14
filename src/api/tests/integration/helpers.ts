import supertest from 'supertest'
import sakiewkaCrypto from 'sakiewka-crypto'

import app from '../../app'
const { constants } = sakiewkaCrypto

export const randomString = () => Math.random().toString(36).substring(7)

export const getUser = async () => {
  const login = `testlogin${randomString()}`

  // first register new user
  await supertest(app)
    .post(`/${constants.BASE_API_PATH}/user/register`)
    .send({
      login,
      password: 'abcd'
    })

  // then logs him in and get token
  const response = await supertest(app)
    .post(`/${constants.BASE_API_PATH}/user/login`)
    .send({
      login,
      password: 'abcd'
    })

  return {
    login,
    token: response.body.data.token
  }
}

export const getWalletId = async (token: string) => {
  const response = await supertest(app)
    .post(`/${constants.BASE_API_PATH}/btc/wallet/create`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'testName',
      passphrase: 'aaa',
      userPubKey: 'xpub661MyMwAqRbcEbQrpBDMTDgW5Hjg5BFxoJD2SnzTmTASPxD4i4j1xMCKojYwgaRXXBRAHB7WPECxA2aQVfL61G4mWjnHMj6BJtAQKMVAiYs',
      backupPubKey: 'xpub661MyMwAqRbcGukLdXtbs5TTqkddNUYzdWAmZ3mQTRZgtaySzU9ePfVEZWtQJBZGbfKfhPZfG74z6TXkeEx2atofMhn2n4bHLzjDWHREM5u'
    })

  return response.body.data.walletId
}

export const getAddress = async (token: string, walletId: string) => {
  const response = await supertest(app)
    .post(`/${constants.BASE_API_PATH}/btc/wallet/${walletId}/address`)
    .set('Authorization', `Bearer ${token}`)

  return response.body.data.address
}

export const getKeyId = async (token: string) => {
  const walletId = await getWalletId(token)
  const response = await supertest(app)
    .get(`/${constants.BASE_API_PATH}/btc/wallet/${walletId}`)
    .set('Authorization', `Bearer ${token}`)

  return response.body.data.keys[2].id
  // TODO: test also other 2 keys
}
