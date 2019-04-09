import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../../response'
import { sendTransactionRequest } from '../../models'
import validate from '../../validate'
import { Currency, constants } from 'sakiewka-crypto'


const sendCoins = (sakiewkaCrypto, currency: Currency) => async (req: Request, res: Response) => {
  const { transaction } = sakiewkaCrypto[currency]

  const { errors, body } = validate(req, sendTransactionRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }

  const backendResponse = await transaction.send(
    req.header('authorization'),
    req.params.walletId,
    body.recipients,
    body.xprv,
    body.passphrase
  )

  jsonResponse(res, backendResponse)
}

export default sendCoins
