import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { registerRequest } from '../../models'
import { jsonResponse, errorResponse } from '../../response'
import validate from '../../validate'

const { constants, user, crypto } = sakiewkaCrypto

const register = async (req: Request, res: Response) => {
  const validationErrors = validate(req, registerRequest)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const { login, password } = req.body
  const backendResponse = await user.register(login, crypto.hashPassword(password))

  jsonResponse(res, backendResponse)
}

export default register
