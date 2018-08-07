import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../response'
import { infoRequest } from '../models'
import validate from '../validate'

const { user, constants } = sakiewkaCrypto

const info = async (req: Request, res: Response) => {
  const validationErrors = validate(req, infoRequest, true)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const token = req.header('authorization')
  const backendResponse = await user.info(token)

  jsonResponse(res, backendResponse)
}

export default info
