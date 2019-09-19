import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'
import { constants } from 'sakiewka-crypto'
import { forBTCandBTG } from '../../helpers'

forBTCandBTG('get webhook', (currency) => {

// @ts-ignore
  const { webhooks } = app.sakiewkaApi[currency]

// @ts-ignore
  const mockFn = jest.fn().mockResolvedValue('test webhook')

  webhooks.getWebhook = mockFn

  describe(`/${currency}/wallet/walletId/webhooks`, () => {
    it('should not accept incomplete request', async () => {
      const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet/testWallet123/webhooks/testWebhook123`)

      expect(response.status).to.be.equal(400)
      expect(response.body.errors[0].message).to.be.equal('Request header Authorization is required.')
    })

    it('should get webhook', async () => {
      const token = 'testToken'
      const walletId = 'testWalletId'
      const webhookId = 'testWebhookId'

      const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/wallet/${walletId}/webhooks/${webhookId}`)
      .set('Authorization', `Bearer ${token}`)

      const callArgs = mockFn.mock.calls[0]

      expect(response.status).to.be.equal(200)
      const data = response.body.data
      expect(data).to.eq('test webhook')
      expect(callArgs[0]).to.eq(`Bearer ${token}`)
      expect(callArgs[1]).to.eq(walletId)
    })
  })
})
