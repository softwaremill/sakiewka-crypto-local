import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../../../response'
import { listTransfersRequest } from '../../../models'
import { constants, TransfersApi } from 'sakiewka-crypto'
import validate from '../../../validate'

const listTransfers = (transfers: TransfersApi) => async (
  req: Request,
  res: Response
) => {
  const { errors, queryParams } = validate(req, listTransfersRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }

  const backendResponse = await transfers.listTransfers(
    req.header('authorization') || '',
    queryParams.limit,
    queryParams.nextPageToken
  )

  jsonResponse(res, backendResponse)
}

export default listTransfers
