import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import sakiewkaCrypto from 'sakiewka-crypto'
const { constants } = sakiewkaCrypto
import { getUser } from '../helpers'

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
    process.env.PRV_KEY = 'xprv9s21ZrQH143K27LPi9gM65jmXFuBfiY7S5HReQarD7dTX9svAXQmQYsqxVqMcbtRWxDwBkdRxSxhfPBX4Vt7Juc9CqY4i3AaPNwCeM1w1Ym'
    const { token } = await getUser()
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eth/wallet/send-coins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        address: '123',
        amount: '100',
        data: ''
      })

    expect(response.status).to.be.equal(200)
  })

  it('should send eth with prvKey from params', async () => {
    process.env.PRV_KEY = ''
    const { token } = await getUser()
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eth/wallet/send-coins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        address: '123',
        amount: '100',
        data: '',
        prvKey: 'xprv9s21ZrQH143K27LPi9gM65jmXFuBfiY7S5HReQarD7dTX9svAXQmQYsqxVqMcbtRWxDwBkdRxSxhfPBX4Vt7Juc9CqY4i3AaPNwCeM1w1Ym'
      })

    expect(response.status).to.be.equal(200)
  })

  it('should throw when no prvKey', async () => {
    process.env.PRV_KEY = ''
    const { token } = await getUser()
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
    process.env.PRV_KEY = 'xprv9s21ZrQH143K27LPi9gM65jmXFuBfiY7S5HReQarD7dTX9svAXQmQYsqxVqMcbtRWxDwBkdRxSxhfPBX4Vt7Juc9CqY4i3AaPNwCeM1w1Ym'
    const { token } = await getUser()
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eth/wallet/send-tokens`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        address: '123',
        amount: '100',
        contractAddress: '123'
      })

    expect(response.status).to.be.equal(200)
  })

  it('should send tokens with prvKey from params', async () => {
    process.env.PRV_KEY = ''
    const { token } = await getUser()
    const response = await supertest(app)
      .post(`/${constants.BASE_API_PATH}/eth/wallet/send-tokens`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        address: '123',
        amount: '100',
        contractAddress: '321',
        prvKey: 'xprv9s21ZrQH143K27LPi9gM65jmXFuBfiY7S5HReQarD7dTX9svAXQmQYsqxVqMcbtRWxDwBkdRxSxhfPBX4Vt7Juc9CqY4i3AaPNwCeM1w1Ym'
      })

    expect(response.status).to.be.equal(200)
  })

  it('should throw when no prvKey', async () => {
    process.env.PRV_KEY = ''
    const { token } = await getUser()
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
