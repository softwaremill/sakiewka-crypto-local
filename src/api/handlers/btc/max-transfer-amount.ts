import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../../response'
import { maxTransferAmountRequest } from '../../models'
import validate from '../../validate'
import sakiewkaCrypto, { Currency } from 'sakiewka-crypto'


const maxTransferAmount = (currency: Currency) => async (req: Request, res: Response) => {
  const { constants } = sakiewkaCrypto
  const { wallet } = sakiewkaCrypto[currency]

  const { errors, queryParams } = validate(req, maxTransferAmountRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }
  const { feeRate, recipient } = queryParams
  const backendResponse = await wallet.maxTransferAmount(req.header('authorization'), req.param('walletId'), feeRate, recipient)

  jsonResponse(res, backendResponse)
}

export default maxTransferAmount
