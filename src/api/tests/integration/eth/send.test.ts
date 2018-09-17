import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import sakiewkaCrypto from 'sakiewka-crypto'
const { constants, transactionEth } = sakiewkaCrypto

// @ts-ignore
const mockFnEth = jest.fn(() => {
  return new Promise((resolve: Function) => {
    resolve('eth')
  })
})

// @ts-ignore
const mockFnTokens = jest.fn(() => {
  return new Promise((resolve: Function) => {
    resolve('tokens')
  })
})

transactionEth.sendETH = mockFnEth
transactionEth.sendToken = mockFnTokens

const xprv = 'xprv9s21ZrQH143K27LPi9gM65jmXFuBfiY7S5HReQarD7dTX9svAXQmQYsqxVqMcbtRWxDwBkdRxSxhfPBX4Vt7Juc9CqY4i3AaPNwCeM1w1Ym'

beforeEach(() => {
  mockFnEth.mockClear()
  mockFnTokens.mockClear()
})

describe('/eth/wallet/send-coins', () => {
  it('should exist', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eth/wallet/send-coins`)

    expect(response.status).to.not.be.equal(404)
  })

  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eth/wallet/send-coins`)

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('"address" is required')
  })

  it('should not accept request with missing header', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eth/wallet/send-coins`)
      .send({
        address: '123',
        amount: '100',
        data: ''
      })

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('Request header Authorization is required.')
  })

  it('should send eth whith prvKey from env', async () => {
    process.env.PRV_KEY = xprv
    const token = 'testToken'
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eth/wallet/send-coins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        address: '123',
        amount: '100',
        data: ''
      })

    const callArgs = mockFnEth.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('eth')
    expect(callArgs[0]).to.eq(`Bearer ${token}`)
    expect(callArgs[1]).to.eq(process.env.PRV_KEY)
    expect(callArgs[2]).to.eq('123')
    expect(callArgs[3]).to.eq('100')
    expect(callArgs[4]).to.eq('')
  })

  it('should send eth with prvKey from params', async () => {
    process.env.PRV_KEY = ''
    const token = 'testToken'
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eth/wallet/send-coins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        address: '1234',
        amount: '1000',
        data: 'aa',
        prvKey: xprv
      })

    const callArgs = mockFnEth.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('eth')
    expect(callArgs[0]).to.eq(`Bearer ${token}`)
    expect(callArgs[1]).to.eq(xprv)
    expect(callArgs[2]).to.eq('1234')
    expect(callArgs[3]).to.eq('1000')
    expect(callArgs[4]).to.eq('aa')
  })

  it('should throw when no prvKey', async () => {
    process.env.PRV_KEY = ''
    const token = 'testToken'
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eth/wallet/send-coins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        address: '123',
        amount: '100',
        data: ''
      })

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('"prvKey" is required')
  })
})

describe('/eth/wallet/send-tokens', () => {
  it('should exist', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eth/wallet/send-tokens`)

    expect(response.status).to.not.be.equal(404)
  })

  it('should not accept incomplete request', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eth/wallet/send-tokens`)

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('"address" is required')
  })

  it('should not accept request with missing header', async () => {
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eth/wallet/send-tokens`)
      .send({
        address: '123',
        amount: '100',
        contractAddress: '321'
      })

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('Request header Authorization is required.')
  })

  it('should send tokens whith prvKey from env', async () => {
    process.env.PRV_KEY = xprv
    const token = 'testToken'
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eth/wallet/send-tokens`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        address: '123',
        amount: '100',
        contractAddress: '123'
      })

    const callArgs = mockFnTokens.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('tokens')
    expect(callArgs[0]).to.eq(`Bearer ${token}`)
    expect(callArgs[1]).to.eq(process.env.PRV_KEY)
    expect(callArgs[2]).to.eq('123')
    expect(callArgs[3]).to.eq('123')
    expect(callArgs[4]).to.eq('100')
  })

  it('should send tokens with prvKey from params', async () => {
    process.env.PRV_KEY = ''
    const token = 'testToken'
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eth/wallet/send-tokens`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        address: '123',
        amount: '100',
        contractAddress: '321',
        prvKey: xprv
      })

    const callArgs = mockFnTokens.mock.calls[0]

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('tokens')
    expect(callArgs[0]).to.eq(`Bearer ${token}`)
    expect(callArgs[1]).to.eq(xprv)
    expect(callArgs[2]).to.eq('123')
    expect(callArgs[3]).to.eq('321')
    expect(callArgs[4]).to.eq('100')
  })

  it('should throw when no prvKey', async () => {
    process.env.PRV_KEY = ''
    const token = 'testToken'
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eth/wallet/send-tokens`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        address: '123',
        amount: '100',
        contractAddress: '321'
      })

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('"prvKey" is required')
  })
})
