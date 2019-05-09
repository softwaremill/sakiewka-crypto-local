import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'
import { currency } from '../../helpers'
import { constants } from 'sakiewka-crypto'
// @ts-ignore
const { key } = app[currency].cryptoModule

// @ts-ignore
const mockFnGenerate = jest.fn().mockReturnValue('test key')

// @ts-ignore
const mockFnEncrypt = jest.fn().mockReturnValue('test key')

key.generateNewKeyPair = mockFnGenerate
key.encryptKeyPair = mockFnEncrypt

describe(`/${currency}/key/local`, () => {
  it('should not accept extra parameters', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/${currency}/key/local`)
      .set('Authorization', 'Bearer abc')
      .send({
        extraProp: 'test',
        passphrase: 'aaa'
      })

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('"extraProp" is not allowed')
  })

  it('should return keys', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/${currency}/key/local`)

    const callArgs = mockFnGenerate.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data.keyPair).to.eq('test key')
    expect(callArgs[0]).to.eq(undefined)
  })

  it('should return encrypted key', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/${currency}/key/local`)
      .send({
        passphrase: 'abcd'
      })

    const callArgsGenerate = mockFnGenerate.mock.calls[1]
    const callArgsEncrypt = mockFnEncrypt.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data.keyPair).to.eq('test key')
    expect(callArgsGenerate[0]).to.eq(undefined)
    expect(callArgsEncrypt[0]).to.eq('test key')
    expect(callArgsEncrypt[1]).to.eq('abcd')
  })
})
