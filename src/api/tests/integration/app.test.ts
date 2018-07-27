import { expect } from 'chai'
import app from '../../app'
import supertest from 'supertest'

import sakiewkaCrypto from 'sakiewka-crypto'

const { constants } = sakiewkaCrypto

let server

const randomString = () => Math.random().toString(36).substring(7)

const getUser = async () => {
  const login = `testlogin${randomString()}`

  // first register new user
  await supertest(app)
    .post(`/${constants.BASE_API_PATH}/user/register`)
    .send({
      login,
      password: 'abcd'
    })

  // then logs him in and get token
  const response = await supertest(app)
    .post(`/${constants.BASE_API_PATH}/user/login`)
    .send({
      login,
      password: 'abcd'
    })

  return {
    login,
    token: response.body.data.token
  }
}

const getWalletId = async (token: string) => {
  const response = await supertest(app)
    .post(`/${constants.BASE_API_PATH}/btc/wallet/create`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      label: 'testLabel',
      passphrase: 'aaa',
      userPubKey: '123'
    })

  return response.body.data.walletId
}

describe('server', () => {
  beforeEach(() => {
    server = app.listen('5678', () => {})
  })

  afterEach(() => {
    server.close()
  })

  describe('/', () => {
    it('should exist', async () => {
      const response = await supertest(app).get('/')
      expect(response.status).to.be.equal(200)
    })
  })

  describe('404', () => {
    it('should properly handle 404 error', async () => {
      const response = await supertest(app).get('/some-route')
      expect(response.status).to.be.equal(404)
    })
  })

  describe('/user/register', () => {
    it('should not accept incomplete request', async () => {
      const response = await supertest(app)
        .post(`/${constants.BASE_API_PATH}/user/register`)
        .send({ login: 'testLogin' })

      expect(response.status).to.be.equal(400)
      expect(response.body.message).to.be.equal('Property password is required.')
    })

    it('should not accept extra paramters', async () => {
      const response = await supertest(app)
        .post(`/${constants.BASE_API_PATH}/user/register`)
        .send({
          login: 'testLogin',
          password: 'abcd',
          extraProp: 'test'
        })

      expect(response.status).to.be.equal(400)
      expect(response.body.message).to.be.equal('Property extraProp is not supported.')
    })

    it('should register user', async () => {
      const response = await supertest(app)
        .post(`/${constants.BASE_API_PATH}/user/register`)
        .send({
          login: `testlogin${randomString()}`,
          password: 'abcd'
        })

      expect(response.status).to.be.equal(200)
      expect(response.body.data).to.be.empty
    })
  })

  describe('/user/login', () => {
    it('should not accept incomplete request', async () => {
      const response = await supertest(app)
        .post(`/${constants.BASE_API_PATH}/user/login`)
        .send({ login: 'testLogin' })

      expect(response.status).to.be.equal(400)
      expect(response.body.message).to.be.equal('Property password is required.')
    })

    it('should not accept extra paramters', async () => {
      const response = await supertest(app)
        .post(`/${constants.BASE_API_PATH}/user/login`)
        .send({
          login: 'testLogin',
          password: 'abcd',
          extraProp: 'test'
        })

      expect(response.status).to.be.equal(400)
      expect(response.body.message).to.be.equal('Property extraProp is not supported.')
    })

    it('should login user', async () => {
      const login = `testlogin${randomString()}`

      // first registers new user
      await supertest(app)
        .post(`/${constants.BASE_API_PATH}/user/register`)
        .send({
          login,
          password: 'abcd'
        })

      const response = await supertest(app)
        .post(`/${constants.BASE_API_PATH}/user/login`)
        .send({
          login,
          password: 'abcd'
        })

      expect(response.status).to.be.equal(200)
      expect(response.body.data.token).to.be.a('string')
      expect(response.body.data.token).to.have.lengthOf(64)
    })
  })

  describe('/user/info', () => {
    it('should not accept request with missing header', async () => {
      const response = await supertest(app)
        .get(`/${constants.BASE_API_PATH}/user/info`)

      expect(response.status).to.be.equal(400)
      expect(response.body.message).to.be.equal('Request header Authorization is required.')
    })

    it('should fetch user info', async () => {
      const { token, login } = await getUser()

      const response = await supertest(app)
        .get(`/${constants.BASE_API_PATH}/user/info`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).to.be.equal(200)
      expect(response.body.data.email).to.be.equal(login)
      expect(response.body.data.token).to.have.lengthOf(64)
      expect(response.body.data.tokenInfo.expiry).to.be.a('string')
    })
  })

  describe('/btc/wallet/create', () => {
    it('should not accept incomplete request', async () => {
      const response = await supertest(app)
        .post(`/${constants.BASE_API_PATH}/btc/wallet/create`)
        .set('Authorization', `Bearer abc`)

      expect(response.status).to.be.equal(400)
      expect(response.body.message).to.be.equal('Property label is required.')
    })

    it('should not accept extra parameters', async () => {
      const response = await supertest(app)
        .post(`/${constants.BASE_API_PATH}/btc/wallet/create`)
        .set('Authorization', `Bearer abc`)
        .send({
          label: 'testLabel',
          passphrase: 'aaa',
          userPubKey: '123',
          backupPubKey: '142',
          extraProp: 'abcd'
        })

      expect(response.status).to.be.equal(400)
      expect(response.body.message).to.be.equal('Property extraProp is not supported.')
    })

    it('should create wallet', async () => {
      const { token } = await getUser()

      const response = await supertest(app)
        .post(`/${constants.BASE_API_PATH}/btc/wallet/create`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          label: 'testLabel',
          passphrase: 'aaa',
          userPubKey: '123'
        })

      expect(response.status).to.be.equal(200)
      expect(response.body.data.user.pubKey).to.eq('123')
      expect(response.body.data.backup.privKey).to.have.lengthOf(111)
    })
  })

  describe('/btc/wallet/id', () => {
    it('should not accept incomplete request', async () => {
      const response = await supertest(app)
        .get(`/${constants.BASE_API_PATH}/btc/wallet/1234`)

      expect(response.status).to.be.equal(400)
      expect(response.body.message).to.be.equal('Request header Authorization is required.')
    })

    it('should get wallet', async () => {
      const { token } = await getUser()
      const walletId = await getWalletId(token)

      const response = await supertest(app)
        .get(`/${constants.BASE_API_PATH}/btc/wallet/${walletId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).to.be.equal(200)
      expect(response.body.data).to.haveOwnProperty('id')
      expect(response.body.data).to.haveOwnProperty('label')
      expect(response.body.data).to.haveOwnProperty('currency')
      expect(response.body.data).to.haveOwnProperty('created')
      expect(response.body.data.id).to.equal(walletId)
      expect(response.body.data.label).to.equal('testLabel')
      expect(response.body.data.currency).to.equal('BTC')
    })
  })

  describe('/btc/wallet', () => {
    it('should not accept incomplete request', async () => {
      const response = await supertest(app)
        .get(`/${constants.BASE_API_PATH}/btc/wallet`)

      expect(response.status).to.be.equal(400)
      expect(response.body.message).to.be.equal('Request header Authorization is required.')
    })

    it('should return list of wallets', async () => {
      const { token } = await getUser()
      const walletId = await getWalletId(token)

      const response = await supertest(app)
        .get(`/${constants.BASE_API_PATH}/btc/wallet?limit=20`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).to.be.equal(200)
      expect(response.body.data).to.haveOwnProperty('wallets')
      expect(response.body.data.wallets).to.have.lengthOf(1)
      expect(response.body.data.wallets[0].label).to.eq('testLabel')
      expect(response.body.data.wallets[0].id).to.eq(walletId)
    })
  })

  describe('/btc/key/create', () => {
    it('should not accept extra parameters', async () => {
      const response = await supertest(app)
        .post(`/${constants.BASE_API_PATH}/btc/key/create`)
        .set('Authorization', `Bearer abc`)
        .send({
          extraProp: 'test',
          passphrase: 'aaa'
        })

      expect(response.status).to.be.equal(400)
      expect(response.body.message).to.be.equal('Property extraProp is not supported.')
    })

    it('should return keys', async () => {
      const { token } = await getUser()

      const response = await supertest(app)
        .post(`/${constants.BASE_API_PATH}/btc/key/create`)

      expect(response.status).to.be.equal(200)
      expect(response.body.data).to.haveOwnProperty('keypair')
      expect(response.body.data.keypair).to.haveOwnProperty('pubKey')
      expect(response.body.data.keypair).to.haveOwnProperty('privKey')
      expect(response.body.data.keypair.pubKey).to.have.lengthOf(111)
      expect(response.body.data.keypair.privKey).to.have.lengthOf(111)
    })

    it('should return encrypted key', async () => {
      const { token } = await getUser()

      const response = await supertest(app)
        .post(`/${constants.BASE_API_PATH}/btc/key/create`)
        .send({
          passphrase: 'abcd'
        })

      expect(response.status).to.be.equal(200)
      expect(response.body.data).to.haveOwnProperty('keypair')
      expect(response.body.data.keypair).to.haveOwnProperty('pubKey')
      expect(response.body.data.keypair).to.haveOwnProperty('privKey')
      expect(response.body.data.keypair.pubKey).to.have.lengthOf(111)
      expect(response.body.data.keypair.privKey).to.have.lengthOf(298)
    })
  })
})
