import { expect } from 'chai'
import app from '../../../app'
import supertest from 'supertest'

import sakiewkaCrypto from 'sakiewka-crypto'
const { constants } = sakiewkaCrypto
import { getUser } from '../helpers'

describe('/user/info', () => {
  it('should not accept request with missing header', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/user/info`)

    expect(response.status).to.be.equal(400)
    expect(response.body.error.message).to.be.equal('Request header Authorization is required.')
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
