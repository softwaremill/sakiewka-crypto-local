import { Request, Response } from 'express'
import { constants, WebhooksApi } from 'sakiewka-crypto'
import { errorResponse, jsonResponse } from '../../../response'
import validate from '../../../validate'
import { getWebhookRequest } from '../../../models'

const getWebhook = (webhooks: WebhooksApi) => async (
  req: Request,
  res: Response
) => {
  const { errors } = validate(req, getWebhookRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }

  const token = req.header('authorization') || ''
  const walletId = req.params.walletId
  const webhookId = req.params.webhookId
  const walletData = await webhooks.getWebhook(token, walletId, webhookId)

  jsonResponse(res, walletData)
}

export default getWebhook
