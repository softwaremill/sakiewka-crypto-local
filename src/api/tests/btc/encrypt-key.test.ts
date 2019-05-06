import { expect } from 'chai'
import app from '../../app'
import supertest from 'supertest'
import { currency } from '../helpers'
import { constants } from 'sakiewka-crypto'
// @ts-ignore
const { key } = app[currency].cryptoModule

// @ts-ignore
const mockFnEncrypt = jest.fn(() => {
  return 'test key'
})

key.encryptKeyPair = mockFnEncrypt

describe(`/${currency}/key/local/encrypt`, () => {
  it('should not accept extra parameters', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/${currency}/key/local/encrypt`)
      .set('Authorization', 'Bearer abc')
      .send({
        keyPair: {
          pubKey: '0x1',
          prvKey: '0x2',
          extraProp: 'test'
        },
        passphrase: 'aaa'
      })

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('"extraProp" is not allowed')
  })

  it('should return encrypted key', async () => {
    const keyPair = {
      pubKey: '0x1',
      prvKey: '0x2'
    };
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/${currency}/key/local/encrypt`)
      .send({
        keyPair,
        passphrase: 'abcd'
      })

    const callArgsEncrypt = mockFnEncrypt.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data.keyPair).to.eq('test key')
    expect(callArgsEncrypt[0]).to.eql(keyPair)
    expect(callArgsEncrypt[1]).to.eq('abcd')
  })
})
