import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../response'
import { logoutRequest } from '../models'
import validate from '../validate'

const { backendApi, constants } = sakiewkaCrypto

const info = async (req: Request, res: Response) => {
  const validationErrors = validate(req, logoutRequest, true)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const token = req.header('authorization')
  const backendResponse = await backendApi.logout(token)

  // TODO: check if there was no errors during backend request
  jsonResponse(res, backendResponse)
}

export default info
