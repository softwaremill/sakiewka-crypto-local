import { Request, Response } from 'express'

import { constants } from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../response'
import { logoutRequest } from '../../models'
import validate from '../../validate'

export const logout = (sakiewkaCrypto) => async (req: Request, res: Response) => {
  const { errors } = validate(req, logoutRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }

  jsonResponse(res, {})
}