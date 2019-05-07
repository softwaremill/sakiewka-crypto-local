import { Request, Response } from 'express'

import { constants } from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../../response'
import { setupPasswordRequest } from '../../../models'
import validate from '../../../validate'

export const setupPassword = (sakiewkaCrypto) => async (req: Request, res: Response) => {
  const { errors, body } = validate(req, setupPasswordRequest, false)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }
  const { password } = body
  const token = req.header('authorization')
  const backendResponse = await sakiewkaCrypto.user.setupPassword(token, password)

  jsonResponse(res, backendResponse)
}

export default setupPassword
