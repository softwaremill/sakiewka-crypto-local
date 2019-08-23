import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../../../response'
import { findTransferByTxHashRequest } from '../../../models'
import { constants, ChainTransfersApi } from 'sakiewka-crypto'
import validate from '../../../validate'

const findTransferByTxHash = (transfers: ChainTransfersApi) => async (
  req: Request,
  res: Response
) => {
  const { errors } = validate(req, findTransferByTxHashRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }

  const backendResponse = await transfers.findTransferByTxHash(
    req.header('authorization') || '',
    req.params.walletId,
    req.params.txHash
  )

  jsonResponse(res, backendResponse)
}

export default findTransferByTxHash
