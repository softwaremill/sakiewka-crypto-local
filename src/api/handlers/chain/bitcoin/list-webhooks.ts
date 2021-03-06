import { Request, Response } from 'express'
import { constants, WebhooksApi } from 'sakiewka-crypto'
import { errorResponse, jsonResponse } from '../../../response'
import validate from '../../../validate'
import { listWebhookRequest } from '../../../models'

const listWebhooks = (webhooks: WebhooksApi) => async (
  req: Request,
  res: Response
) => {
  const { errors, queryParams } = validate(req, listWebhookRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }

  const token = req.header('authorization') || ''
  const walletId = req.params.walletId
  const walletData = await webhooks.listWebhooks(
    token,
    walletId,
    queryParams.limit,
    queryParams.nextPageToken
  )

  jsonResponse(res, walletData)
}

export default listWebhooks
