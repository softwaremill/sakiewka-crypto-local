import { Request, Response } from 'express'
import { Currency } from 'sakiewka-crypto'
import { jsonResponse } from '../../response'

const listWebhooks = (sakiewkaCrypto, currency: Currency) => async (req: Request, res: Response) => {
  const { webhooks } = sakiewkaCrypto[currency]

  const token = req.header('authorization')
  const walletId = req.params.walletId
  const limit = req.query.limit || 10
  const walletData = await webhooks.listWebhooks(
    token, walletId, limit
  )

  jsonResponse(res, walletData)
}

export default listWebhooks
