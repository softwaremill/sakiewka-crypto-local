import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import sakiewkaCrypto from 'sakiewka-crypto'
const { constants } = sakiewkaCrypto

describe('/eth/wallet/sign', () => {
  it('should sign a proper eth request', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eth/wallet/sign`)
      .send({
        pk: '82d052c865f5763aad42add438569276c00d3d88a2d062d36b2bae914d58b8c8',
        address: '0x2191ef87e392377ec08e7c08eb105ef5448eced5',
        amount: '200',
        data: '',
        expireTime: new Date().getTime() + 3600000 /* one hour from now */,
        contractNonce: 1
      })

    expect(response.status).to.be.equal(200)
  })
})

describe('/eth/wallet/tokenSign', () => {
  it('should sign a proper token request', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eth/wallet/tokenSign`)
      .send({
        pk: '82d052c865f5763aad42add438569276c00d3d88a2d062d36b2bae914d58b8c8',
        address: '0x2191ef87e392377ec08e7c08eb105ef5448eced5',
        amount: '200',
        contractAddress: '0x2932b7a2355d6fecc4b5c0b6bd44cc31df247a2e',
        expireTime: new Date().getTime() + 3600000 /* one hour from now */,
        contractNonce: 1
      })

    expect(response.status).to.be.equal(200)
  })
})
