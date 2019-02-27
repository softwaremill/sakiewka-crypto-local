import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../../response'
import { listTransfersRequest } from '../../models'
import sakiewkaCrypto from 'sakiewka-crypto'
import validate from '../../validate'

const { constants, transfers } = sakiewkaCrypto

const listTransfers = async (req: Request, res: Response) => {
  const validationErrors = validate(req, listTransfersRequest, true)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const backendResponse = await transfers.listTransfers(
    req.header('authorization'),
    req.query.walletId,
    req.query.limit,
    req.query.nextPageToken
  )

  jsonResponse(res, backendResponse)
}

export default listTransfers
