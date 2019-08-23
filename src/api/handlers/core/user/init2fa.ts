import { Request, Response } from 'express'

import { constants, UserApi } from 'sakiewka-crypto'
import { errorResponse, jsonResponse } from '../../../response'
import { init2faRequest } from '../../../models'
import validate from '../../../validate'

export const init2fa = (user: UserApi) => async (
  req: Request,
  res: Response
) => {
  const { errors, body } = validate(req, init2faRequest)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }

  const { password } = body
  const token = req.header('authorization') || ''
  const backendResponse = await user.init2fa(token, password)

  jsonResponse(res, backendResponse)
}
