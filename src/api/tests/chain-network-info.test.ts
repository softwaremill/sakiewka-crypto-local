import { expect } from 'chai'
import app from '../app'
import supertest from 'supertest'
import { constants } from 'sakiewka-crypto'
// @ts-ignore
const { core } = app.backendApi

// @ts-ignore
const mockFn = jest.fn().mockResolvedValue('regtest')

core.chainNetworkType = mockFn

describe('/chain-network-type', () => {
  beforeEach(() => {
    mockFn.mockClear()
  })

  it('should get chain network type', async () => {
    const response = await supertest(app)
      .get(`/${constants.BASE_API_PATH}/chain-network-type`)
      .send()

    expect(response.status).to.be.equal(200)
    const data = response.body.data
    expect(data).to.eq('regtest')
  })
})
