import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../../../response'
import { listWalletTransfersRequest } from '../../../models'
import validate from '../../../validate'
import { constants, EosChainTransfersApi } from 'sakiewka-crypto'

const listEosWalletTransfers = (transfers: EosChainTransfersApi) => async (
  req: Request,
  res: Response
) => {
  const { errors, queryParams } = validate(
    req,
    listWalletTransfersRequest,
    true
  )

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }

  const backendResponse = await transfers.listTransfers(
    req.header('authorization') || '',
    req.params.walletId,
    queryParams.limit,
    queryParams.nextPageToken
  )

  jsonResponse(res, backendResponse)
}

export default listEosWalletTransfers
