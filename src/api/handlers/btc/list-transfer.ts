import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../response'
import { listTransfersRequest } from '../../models'
import validate from '../../validate'

const { constants } = sakiewkaCrypto

const info = async (req: Request, res: Response) => {
  const validationErrors = validate(req, listTransfersRequest, true)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  jsonResponse(res, {})
}

export default info
