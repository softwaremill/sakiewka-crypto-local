import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import { constants } from 'sakiewka-crypto'
import { forBTCandBTG } from '../../helpers'

forBTCandBTG('create address', (currency) => {

// @ts-ignore
  const { address } = app.sakiewkaApi[currency]

// @ts-ignore
  const mockFn = jest.fn().mockResolvedValue('new address')

  address.createNewAddress = mockFn

  describe(`/${currency}/wallet/:id/address`, () => {
    it('should exist', async () => {
      const response = await supertest(app)
        .post(`/${constants.BASE_API_PATH}/${currency}/wallet/12/address`)

      expect(response.status).to.not.be.equal(404)
    })

    it('should not accept request with missing header', async () => {
      const response = await supertest(app)
        .post(`/${constants.BASE_API_PATH}/${currency}/wallet/12/address`)

      expect(response.status).to.be.equal(400)
      expect(response.body.errors[0].message).to.be.equal('Request header Authorization is required.')
    })

    it('should pass proper arguments to createNewAddress and return result of its call', async () => {
      const token = 'testToken'
      const walletId = 'testWalletId'
      const response = await supertest(app)
        .post(`/${constants.BASE_API_PATH}/${currency}/wallet/${walletId}/address`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'abcd'
        })

      const callArgs = mockFn.mock.calls[0]

      expect(response.status).to.be.equal(200)
      const data = response.body.data
      expect(data).to.eq('new address')
      expect(callArgs[0]).to.eq(`Bearer ${token}`)
      expect(callArgs[1]).to.eq(walletId)
      expect(callArgs[2]).to.eq('abcd')
    })
  })
})
