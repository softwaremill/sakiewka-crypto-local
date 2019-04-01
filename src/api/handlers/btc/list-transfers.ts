import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../../response'
import { listTransfersRequest } from '../../models'
import sakiewkaCrypto from 'sakiewka-crypto'
import validate from '../../validate'

const { constants, transfers } = sakiewkaCrypto

const listTransfers = async (req: Request, res: Response) => {
  const { errors, queryParams } = validate(req, listTransfersRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }

  const backendResponse = await transfers.listTransfers(
    req.header('authorization'),
    queryParams.walletId,
    queryParams.limit,
    queryParams.nextPageToken
  )

  jsonResponse(res, backendResponse)
}

export default listTransfers
