import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'
import { constants } from 'sakiewka-crypto'
import { forBTCandBTG } from '../../helpers'

forBTCandBTG('list webhook', (currency) => {

// @ts-ignore
  const { webhooks } = app.sakiewkaApi[currency]

// @ts-ignore
  const mockFn = jest.fn().mockResolvedValue('test webhook')

  webhooks.listWebhooks = mockFn

  describe(`/${currency}/wallet/walletId/webhooks`, () => {
    it('should not accept incomplete request', async () => {
      const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet/testWallet123/webhooks?limit=30`)

      expect(response.status).to.be.equal(400)
      expect(response.body.errors[0].message).to.be.equal('Request header Authorization is required.')
    })

    it('should not accept request with missing query params', async () => {
      const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet/testWallet123/webhooks`)

      expect(response.status).to.be.equal(400)
      expect(response.body.errors[0].message).to.be.equal('"limit" is required')
    })

    it('should return list of webhooks', async () => {
      const token = 'testToken'

      const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet/testWallet123/webhooks?limit=20`)
      .set('Authorization', `Bearer ${token}`)

      const callArgs = mockFn.mock.calls[0]

      expect(response.status).to.be.equal(200)
      const data = response.body.data
      expect(data).to.eq('test webhook')
      expect(callArgs[0]).to.eq(`Bearer ${token}`)
      expect(callArgs[1]).to.eq('testWallet123')
      expect(callArgs[2]).to.eq('20')
    })
  })
})
