import { Request, Response } from 'express'

import { constants } from 'sakiewka-crypto'
import { errorResponse, jsonResponse } from '../../../response'
import { confirm2faRequest } from '../../../models'
import validate from '../../../validate'

export const confirm2fa = (sakiewkaCrypto) => async (req: Request, res: Response) => {
  const { errors, body } = validate(req, confirm2faRequest)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }

  const { password, code } = body
  const token = req.header('authorization')
  const backendResponse = await sakiewkaCrypto.user.confirm2fa(token, password, code)

  jsonResponse(res, backendResponse)
}
