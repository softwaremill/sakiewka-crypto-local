import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import { currency } from '../../helpers'
import { constants } from 'sakiewka-crypto'
// @ts-ignore
const { wallet } = app.sakiewkaApi[currency]

// @ts-ignore
const mockFn = jest.fn().mockResolvedValue('test wallet')

wallet.editWallet = mockFn

describe(`patch /${currency}/wallet/id`, () => {
  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .patch(`/${constants.BASE_API_PATH}/${currency}/wallet/1234`)

    expect(response.status).to.be.equal(400)
    expect(response.body.errors[0].message).to.be.equal('"name" is required')
  })

  it('should edit wallet', async () => {
    const token = 'testToken'
    const walletId = 'testWalletId'
    const walletName = 'walletName'

    const response = await supertest(app)
      .patch(`/${constants.BASE_API_PATH}/${currency}/wallet/${walletId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: walletName
      })

    const callArgs = mockFn.mock.calls[0]

    expect(response.status).to.be.equal(200)
    expect(callArgs[0]).to.eq(`Bearer ${token}`)
    expect(callArgs[1]).to.eq(walletId)
    expect(callArgs[2]).to.eq(walletName)
  })
})
