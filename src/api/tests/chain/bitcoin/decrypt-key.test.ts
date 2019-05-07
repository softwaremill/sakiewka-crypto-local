import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'
import { currency } from '../../helpers'
import { constants } from 'sakiewka-crypto'
// @ts-ignore
const { key } = app[currency].cryptoModule

// @ts-ignore
const mockFnDecrypt = jest.fn(() => {
  return 'test key'
})

key.decryptKeyPair = mockFnDecrypt

describe(`/${currency}/key/local/decrypt`, () => {
  it('should not accept extra parameters', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/${currency}/key/local/decrypt`)
      .set('Authorization', 'Bearer abc')
      .send({
        keyPair: {
          pubKey: '0x1',
          prvKey: '0x2',
          extraProp: '0x3'
        },
        passphrase: 'aaa'
      })

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('"extraProp" is not allowed')
  })

  it('should return decrypted keys', async () => {
    const keyPair = {
      pubKey: '0x1',
      prvKey: '0x2',
    };
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/${currency}/key/local/decrypt`)
      .send({
        keyPair,
        passphrase: 'aaa'
      })

    const callArgs = mockFnDecrypt.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data.keyPair).to.eq('test key')
    expect(callArgs[0]).to.eql(keyPair)
    expect(callArgs[1]).to.eql('aaa')
  })
})
