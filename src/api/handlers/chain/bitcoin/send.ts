import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../../../response'
import { sendTransactionRequest } from '../../../models'
import validate from '../../../validate'
import { TransactionApi, constants } from 'sakiewka-crypto'

const sendCoins = (transaction: TransactionApi) => async (
  req: Request,
  res: Response
) => {
  const { errors, body } = validate(req, sendTransactionRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }

  const backendResponse = await transaction.send(
    req.header('authorization') || '',
    req.params.walletId,
    body.recipients,
    body.xprv,
    body.passphrase,
    body.feeRate
  )

  jsonResponse(res, backendResponse)
}

export default sendCoins
