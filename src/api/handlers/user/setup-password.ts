import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../response'
import { setupPasswordRequest } from '../../models'
import validate from '../../validate'

const { user, constants } = sakiewkaCrypto

const setupPassword = async (req: Request, res: Response) => {
  const validationErrors = validate(req, setupPasswordRequest, false)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }
  const { password } = req.body
  const token = req.header('authorization')
  const backendResponse = await user.setupPassword(token, password)

  jsonResponse(res, backendResponse)
}

export default setupPassword
