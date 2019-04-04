import { Request, Response } from 'express'

import { constants } from 'sakiewka-crypto'
import { errorResponse, jsonResponse } from '../../response'
import { loginRequest } from '../../models'
import validate from '../../validate'

export const login = (sakiewkaCrypto) => async (req: Request, res: Response) => {
  const { errors, body } = validate(req, loginRequest)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }

  const { login, password, code } = body
  const backendResponse = await sakiewkaCrypto.user.login(login, password, code)

  jsonResponse(res, backendResponse)
}
