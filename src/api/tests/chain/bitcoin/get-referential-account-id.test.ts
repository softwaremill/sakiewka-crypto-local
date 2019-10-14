import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'
import { constants } from 'sakiewka-crypto'
import { Currency } from "sakiewka-crypto/dist";

describe('get referential account id', () => {

// @ts-ignore
  const { accountFee } = app.sakiewkaApi[Currency.EOS]

// @ts-ignore
  accountFee.getReferentialAccountId = jest.fn().mockResolvedValue('ref-id')

  describe('/eos/user-reference-for-fee', () => {
    it('should return user account reference id', async () => {
      const response = await supertest(app)
        .get(`/${constants.BASE_API_PATH}/eos/user-reference-for-fee`)
        .set('Authorization', `Bearer token`)

      expect(response.status).to.be.equal(200)
      const data = response.body.data
      expect(data).to.eq('ref-id')
    })
  })
})