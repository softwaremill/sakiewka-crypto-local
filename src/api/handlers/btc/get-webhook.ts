import { Request, Response } from 'express'
import { Currency } from 'sakiewka-crypto'
import { jsonResponse } from '../../response'

const getWebhook = (sakiewkaCrypto, currency: Currency) => async (req: Request, res: Response) => {
  const { webhooks } = sakiewkaCrypto[currency]

  const token = req.header('authorization')
  const walletId = req.params.walletId
  const webhookId = req.params.webhookId
  const walletData = await webhooks.getWebhook(
    token, walletId, webhookId
  )

  jsonResponse(res, walletData)
}

export default getWebhook
