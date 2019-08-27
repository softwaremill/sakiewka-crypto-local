import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import { constants, Currency } from 'sakiewka-crypto'
// @ts-ignore
const { wallet } = app.sakiewkaApi[Currency.EOS]

// @ts-ignore
const mockFn = jest.fn().mockResolvedValue('test wallet')

wallet.createWallet = mockFn

describe('/eos/wallet', () => {
  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eos/wallet`)
      .set('Authorization', 'Bearer abc')

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('"name" is required')
  })

  it('should not accept extra parameters', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eos/wallet`)
      .set('Authorization', 'Bearer abc')
      .send({
        name: 'testLabel',
        eosAccountName: 'test1',
        passphrase: 'aaa',
        userPubKey: '123',
        backupPubKey: '142',
        extraProp: 'abcd'
      })

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal(
      '"extraProp" is not allowed'
    )
  })

  it('should create wallet', async () => {
    const token = 'testToken'
    const userPubKey = 'EOS88x9WZbU2fuALQWcfiohdyaEWxonusxcgvmAnEzFwCjsq7Ha4b'
    const backupPubKey =
      'EOS5nbnZDB1BkRd3r8nNF8wJKH6UZsZqfhjLQhcAV7vwpxJZD45qS'

    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eos/wallet`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userPubKey,
        backupPubKey,
        eosAccountName: 'myfirstaddr',
        name: 'testLabel',
        passphrase: '12345678'
      })

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('test wallet')
    expect(callArgs[0]).to.eq(`Bearer ${token}`)
    expect(callArgs[1].passphrase).to.eq('12345678')
    expect(callArgs[1].eosAccountName).to.eq('myfirstaddr')
    expect(callArgs[1].userPubKey).to.eq(userPubKey)
    expect(callArgs[1].backupPubKey).to.eq(backupPubKey)
    expect(callArgs[1].name).to.eq('testLabel')
  })
})
