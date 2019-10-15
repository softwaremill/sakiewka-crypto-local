import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'
import { Currency, constants } from 'sakiewka-crypto'

// @ts-ignore
const { transfers } = app.sakiewkaApi[Currency.EOS]

// @ts-ignore
const mockFn = jest.fn().mockResolvedValue('test transfer')

transfers.findEosTransferByTxHash = mockFn

describe('/eos/wallet/:walletId/transfer/:txHash', () => {
  it('should not accept incomplete request', async () => {
    const response = await supertest(app).get(
      `/${constants.BASE_API_PATH}/eos/wallet/12/transfer/0x1`
    )

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal(
      'Request header Authorization is required.'
    )
  })

  it('should return list of transfers', async () => {
    const token = 'testToken'

    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/eos/wallet/12/transfer/0x1`)
      .set('Authorization', `Bearer ${token}`)

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('test transfer')
    expect(callArgs[0]).to.eq(`Bearer ${token}`)
    expect(callArgs[1]).to.eq('12')
    expect(callArgs[2]).to.eq('0x1')
  })
})
