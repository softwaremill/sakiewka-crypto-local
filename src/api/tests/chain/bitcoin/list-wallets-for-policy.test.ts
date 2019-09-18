import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'
import { constants } from 'sakiewka-crypto'
import { forBTCandBTG } from '../../helpers'

forBTCandBTG('list wallets for policy', (currency) => {

// @ts-ignore
  const { policy } = app.sakiewkaApi[currency]

// @ts-ignore
  const mockFn = jest.fn().mockResolvedValue('list wallets')

  policy.listWalletsForPolicy = mockFn

  describe(`/${currency}/policy/:id/wallet`, () => {
    it('should not accept incomplete request', async () => {
      const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/policy/123/wallet`)

      expect(response.status).to.be.equal(400)
      expect(response.body.errors[0].message).to.be.equal('Request header Authorization is required.')
    })

    it('should return list of wallets', async () => {
      const token = 'testToken'

      const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/policy/123/wallet`)
      .set('Authorization', `Bearer ${token}`)

      const callArgs = mockFn.mock.calls[0]

      expect(response.status).to.be.equal(200)
      const data = response.body.data
      expect(data).to.eq('list wallets')
      expect(callArgs[0]).to.eq(`Bearer ${token}`)
      expect(callArgs[1]).to.eq('123')
    })
  })
})
