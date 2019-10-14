import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import { constants, Currency } from 'sakiewka-crypto'
// @ts-ignore
const { accountFee } = app.sakiewkaApi[Currency.EOS]
// @ts-ignore
const mockFn = jest.fn().mockResolvedValue('test balance')

accountFee.getAccountFee = mockFn

describe('/eos/fees-account', () => {
  it('should return bad request when auth header is missing', async () => {
    const response = await supertest(app).get(
      `/${constants.BASE_API_PATH}/eos/fees-account`
    )

    expect(response.status).to.be.equal(400)
  })

  it('should return account fee balance', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/eos/fees-account`)
      .set('Authorization', 'Bearer 123123')

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('test balance')
    const callArgs = mockFn.mock.calls[0]
    expect(callArgs[0]).to.be.eq('Bearer 123123')
  })
})
