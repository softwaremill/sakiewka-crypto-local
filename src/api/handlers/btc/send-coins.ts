import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../../response'
import { sendTransactionRequest } from '../../models'
import sakiewkaCrypto from 'sakiewka-crypto'
import validate from '../../validate'

const { constants, transaction } = sakiewkaCrypto

const sendCoins = async (req: Request, res: Response) => {
  const validationErrors = validate(req, sendTransactionRequest, true)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const backendResponse = await transaction.sendCoins(
    req.header('authorization'), req.body.xprv, req.params.walletId, req.body.recipients
  )

  jsonResponse(res, backendResponse)
}

export default sendCoins