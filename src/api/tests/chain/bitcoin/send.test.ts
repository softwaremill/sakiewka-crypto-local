import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'
import { BigNumber } from 'bignumber.js'
import { constants } from 'sakiewka-crypto'
import { forBTCandBTG } from '../../helpers'

forBTCandBTG('send', (currency) => {

// @ts-ignore
  const { transaction } = app.sakiewkaApi[currency]

// @ts-ignore
  const mockFn = jest.fn().mockResolvedValue('coins sent')

  transaction.send = mockFn

  describe(`/${currency}/wallet/walletId/send`, () => {

    beforeEach(() => {
      mockFn.mockClear()
    })

    it('should exist', async () => {
      const response = await supertest(app)
        .post(`/${constants.BASE_API_PATH}/${currency}/wallet/123/send`)

      expect(response.status).to.not.equal(404)
    })

    it('should not accept request with missing params', async () => {
      const response = await supertest(app)
        .post(`/${constants.BASE_API_PATH}/${currency}/wallet/123/send`)

      expect(response.status).to.be.equal(400)
      expect(response.body.errors[0].message).to.be.equal('"recipients" is required')
    })

    it('should not accept incomplete request', async () => {
      const response = await supertest(app)
        .post(`/${constants.BASE_API_PATH}/${currency}/wallet/123/send`)
        .send({
          xprv: 'abc',
          recipients: []
        })

      expect(response.status).to.be.equal(400)
      expect(response.body.errors[0].message).to.be.equal('Request header Authorization is required.')
    })

    it('should send btc using xprv', async () => {
      const token = 'testToken'
      const recipients = [{ address: 'abcd', amount: '0.00000123' }]

      const response = await supertest(app)
        .post(`/${constants.BASE_API_PATH}/${currency}/wallet/221/send`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          recipients,
          xprv: 'abc'
        })

      const callArgs = mockFn.mock.calls[0]

      expect(response.status).to.be.equal(200, response.text)
      const data = response.body.data
      expect(data).to.eq('coins sent')
      expect(callArgs[0]).to.eq(`Bearer ${token}`)
      expect(callArgs[1]).to.eq('221')
      expect(callArgs[2][0]).to.eql({ address: 'abcd', amount: new BigNumber('0.00000123') })
      expect(callArgs[3]).to.eq('abc')
      expect(callArgs[4]).to.be.undefined
      expect(callArgs[5]).to.be.undefined
    })

    it('should send btc using passphrase', async () => {
      const token = 'testToken'
      const recipients = [{ address: 'abcd', amount: new BigNumber('0.00000123') }]

      const response = await supertest(app)
        .post(`/${constants.BASE_API_PATH}/${currency}/wallet/221/send`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          recipients,
          passphrase: 'abc'
        })

      const callArgs = mockFn.mock.calls[0]

      expect(response.status).to.be.equal(200, response.text)
      const data = response.body.data
      expect(data).to.eq('coins sent')
      expect(callArgs[0]).to.eq(`Bearer ${token}`)
      expect(callArgs[1]).to.eq('221')
      expect(callArgs[2][0]).to.eql({ address: 'abcd', amount: new BigNumber('0.00000123') })
      expect(callArgs[3]).to.be.undefined
      expect(callArgs[4]).to.eq('abc')
      expect(callArgs[5]).to.be.undefined
    })

    it('should pass user provided feeRate', async () => {
      const token = 'testToken'
      const recipients = [{ address: 'abcd', amount: new BigNumber('0.00000123') }]

      const response = await supertest(app)
        .post(`/${constants.BASE_API_PATH}/${currency}/wallet/221/send`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          recipients,
          passphrase: 'abc',
          feeRate: 322
        })

      const callArgs = mockFn.mock.calls[0]

      expect(response.status).to.be.equal(200, response.text)
      const data = response.body.data
      expect(data).to.eq('coins sent')
      expect(callArgs[0]).to.eq(`Bearer ${token}`)
      expect(callArgs[1]).to.eq('221')
      expect(callArgs[2][0]).to.eql({ address: 'abcd', amount: new BigNumber('0.00000123') })
      expect(callArgs[3]).to.be.undefined
      expect(callArgs[4]).to.eq('abc')
      expect(callArgs[5]).to.be.eq(322)
    })
  })
})
