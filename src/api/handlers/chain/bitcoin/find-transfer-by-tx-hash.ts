import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../../../response'
import { findTransferByTxHashRequest } from '../../../models'
import { constants, Currency } from 'sakiewka-crypto'
import validate from '../../../validate'

const findTransferByTxHash = (sakiewkaCrypto, currency: Currency) => async (req: Request, res: Response) => {
  const { transfers } = sakiewkaCrypto[currency]
  const { errors, queryParams } = validate(req, findTransferByTxHashRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }

  const backendResponse = await transfers.findTransferByTxHash(
    req.header('authorization'),
    queryParams.walletId,
    queryParams.txHash
  )

  jsonResponse(res, backendResponse)
}

export default findTransferByTxHash
