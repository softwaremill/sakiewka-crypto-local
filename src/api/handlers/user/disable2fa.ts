import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { errorResponse, jsonResponse } from '../../response'
import { disable2faRequest } from '../../models'
import validate from '../../validate'

const { constants, user } = sakiewkaCrypto

const disable2fa = async (req: Request, res: Response) => {
  const validationErrors = validate(req, disable2faRequest)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const { password, code } = req.body
  const backendResponse = await user.disable2fa(password, code)

  jsonResponse(res, backendResponse)
}

export default disable2fa
