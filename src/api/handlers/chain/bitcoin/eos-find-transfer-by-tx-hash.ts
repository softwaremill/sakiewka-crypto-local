import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../../../response'
import { findTransferByTxHashRequest } from '../../../models'
import validate from '../../../validate'
import { constants, EosChainTransfersApi } from 'sakiewka-crypto'

const findEosTransferByTxHash = (transfers: EosChainTransfersApi) => async (
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

export default findEosTransferByTxHash
