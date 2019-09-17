import { Request, Response } from 'express'

import { constants, UserApi } from 'sakiewka-crypto'
import { registerRequest } from '../../../models'
import { errorResponse, jsonResponse } from '../../../response'
import validate from '../../../validate'

export const register = (user: UserApi) => async (
  req: Request,
  res: Response
) => {
  const { errors, body } = validate(req, registerRequest)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }

  const { login } = body
  const backendResponse = await user.register(login)

  jsonResponse(res, backendResponse)
}
