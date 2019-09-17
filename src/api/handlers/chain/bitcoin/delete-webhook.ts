import { Request, Response } from 'express'
import { WebhooksApi, constants } from 'sakiewka-crypto'
import { errorResponse, jsonResponse } from '../../../response'
import validate from '../../../validate'
import { deleteWebhookRequest } from '../../../models'

const deleteWebhook = (webhooks: WebhooksApi) => async (
  req: Request,
  res: Response
) => {
  const { errors } = validate(req, deleteWebhookRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }

  const token = req.header('authorization') || ''
  const walletId = req.params.walletId
  const webhookId = req.params.webhookId
  const walletData = await webhooks.deleteWebhook(token, walletId, webhookId)

  jsonResponse(res, walletData)
}

export default deleteWebhook
