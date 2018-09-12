import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../response'
import { getTransferRequest } from '../../models'
import validate from '../../validate'

const { constants } = sakiewkaCrypto

const info = async (req: Request, res: Response) => {
  const validationErrors = validate(req, getTransferRequest, true)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  // TODO: check if there was no errors during backend request
  jsonResponse(res, {})
}

export default info
