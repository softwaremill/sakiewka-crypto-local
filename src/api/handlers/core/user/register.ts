import { Request, Response } from 'express'

import { constants } from 'sakiewka-crypto'
import { registerRequest } from '../../../models'
import { errorResponse, jsonResponse } from '../../../response'
import validate from '../../../validate'

export const register = (sakiewkaCrypto) => async (req: Request, res: Response) => {
  const { errors, body } = validate(req, registerRequest)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }

  const { login, password } = body
  const backendResponse = await sakiewkaCrypto.user.register(login, password)

  jsonResponse(res, backendResponse)
}
