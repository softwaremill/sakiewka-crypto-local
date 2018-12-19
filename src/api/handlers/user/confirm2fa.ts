import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { errorResponse, jsonResponse } from '../../response'
import { confirm2faRequest } from '../../models'
import validate from '../../validate'

const { constants, user } = sakiewkaCrypto

const confirm2fa = async (req: Request, res: Response) => {
  const validationErrors = validate(req, confirm2faRequest)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const { password, code } = req.body
  const backendResponse = await user.confirm2fa(password, code)

  jsonResponse(res, backendResponse)
}

export default confirm2fa
