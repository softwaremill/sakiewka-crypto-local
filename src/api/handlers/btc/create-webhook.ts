import { Request, Response } from 'express'
import { Currency, constants } from 'sakiewka-crypto'
import { errorResponse, jsonResponse } from '../../response'
import { createWebhookRequest } from '../../models'
import validate from '../../validate'

const createWebhook = (sakiewkaCrypto, currency: Currency) => async (req: Request, res: Response) => {
  const { webhooks } = sakiewkaCrypto[currency]
  const { errors, body } = validate(req, createWebhookRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }

  const token = req.header('authorization')
  const walletId = req.params.walletId
  const { callbackUrl, type, settings } = body
  const walletData = await webhooks.createWebhook(
    token, walletId, callbackUrl, type, settings
  )

  jsonResponse(res, walletData)
}

export default createWebhook
