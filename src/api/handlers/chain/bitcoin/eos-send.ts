import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../../../response'
import { eosSendTransactionRequest } from '../../../models'
import validate from '../../../validate'
import { EosTransactionApi, constants } from 'sakiewka-crypto'

const eosSendCoins = (transaction: EosTransactionApi) => async (
  req: Request,
  res: Response
) => {
  const { errors, body } = validate(req, eosSendTransactionRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }

  const backendResponse = await transaction.send(
    req.header('authorization') || '',
    req.params.walletId,
    body.from,
    body.to,
    body.quantity,
    body.memo,
    body.xprv,
    body.passphrase
  )

  jsonResponse(res, backendResponse)
}

export default eosSendCoins
