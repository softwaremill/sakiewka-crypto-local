import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../../response'
import { maxTransferAmountRequest } from '../../models'
import validate from '../../validate'
import sakiewkaCrypto, { Currency } from 'sakiewka-crypto'


const maxTransferAmount = (currency: Currency) => async (req: Request, res: Response) => {
  const { constants } = sakiewkaCrypto
  const { wallet } = sakiewkaCrypto[currency]

  const validationErrors = validate(req, maxTransferAmountRequest, true)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }
  const { feeRate, recipient } = req.query
  const backendResponse = await wallet.maxTransferAmount(req.header('authorization'), req.param('walletId'), feeRate, recipient)

  jsonResponse(res, backendResponse)
}

export default maxTransferAmount
