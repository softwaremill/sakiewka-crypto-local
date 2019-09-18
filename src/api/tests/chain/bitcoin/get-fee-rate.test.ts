import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'
import { constants } from 'sakiewka-crypto'
import { forBTCandBTG } from '../../helpers'

forBTCandBTG('get fee rate', (currency) => {

// @ts-ignore
  const { feeRates } = app.sakiewkaApi[currency]

// @ts-ignore
  const mockFn = jest.fn().mockResolvedValue('test fee')

  feeRates.getFeeRate = mockFn

  describe(`/${currency}/fee-rate`, () => {
    it('should return fee rate', async () => {
      const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/${currency}/fee-rate`)

      expect(response.status).to.be.equal(200)
      const data = response.body.data
      expect(data).to.eq('test fee')
    })
  })
})
