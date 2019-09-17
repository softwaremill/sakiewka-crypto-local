import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import { constants, Currency } from 'sakiewka-crypto'
// @ts-ignore
const { transaction } = app.sakiewkaApi[Currency.EOS]

// @ts-ignore
const mockFn = jest.fn().mockResolvedValue('coins sent')

transaction.send = mockFn

describe('/eos/wallet/walletId/send', () => {
  beforeEach(() => {
    mockFn.mockClear()
  })

  it('should exist', async () => {
    const response = await supertest(app).post(
      `/${constants.BASE_API_PATH}/eos/wallet/123/send`
    )

    expect(response.status).to.not.equal(404)
  })

  it('should not accept request with missing params', async () => {
    const response = await supertest(app).post(
      `/${constants.BASE_API_PATH}/eos/wallet/123/send`
    )

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('"from" is required')
  })

  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eos/wallet/123/send`)
      .send({
        xprv: 'abc',
        from: '1',
        to: '1',
        quantity: { amount: '1', currency: '1' }
      })

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal(
      'Request header Authorization is required.'
    )
  })

  it('should send eos using xprv', async () => {
    const token = 'testToken'

    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eos/wallet/221/send`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        from: 'myAccount',
        to: 'yourAccount',
        quantity: { amount: '5.0000', currency: 'EOS' },
        xprv: 'abc',
        memo: 'customMemo'
      })

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200, response.text)
    const data = response.body.data
    expect(data).to.eq('coins sent')
    expect(callArgs[0]).to.eq(`Bearer ${token}`)
    expect(callArgs[1]).to.eq('221')
    expect(callArgs[2]).to.eq('myAccount')
    expect(callArgs[3]).to.eq('yourAccount')
    expect(callArgs[4]).to.eql({
      amount: '5.0000',
      currency: 'EOS'
    })
    expect(callArgs[5]).to.eq('customMemo')
    expect(callArgs[6]).to.eq('abc')
    expect(callArgs[7]).to.be.undefined
  })

  it('should send eos using passphrase', async () => {
    const token = 'testToken'
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eos/wallet/221/send`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        from: 'myAccount',
        to: 'yourAccount',
        quantity: { amount: '5.0000', currency: 'EOS' },
        passphrase: 'abc'
      })

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200, response.text)
    const data = response.body.data
    expect(data).to.eq('coins sent')
    expect(callArgs[0]).to.eq(`Bearer ${token}`)
    expect(callArgs[1]).to.eq('221')
    expect(callArgs[2]).to.eq('myAccount')
    expect(callArgs[3]).to.eq('yourAccount')
    expect(callArgs[4]).to.eql({
      amount: '5.0000',
      currency: 'EOS'
    })
    expect(callArgs[5]).to.be.undefined
    expect(callArgs[6]).to.be.undefined
    expect(callArgs[7]).to.eq('abc')
  })
})
