import { expect } from 'chai'
import app from '../app'
import supertest from 'supertest'

describe('server', () => {
  let server

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
})
