import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { registerRequest } from '../../models'
import { errorResponse, jsonResponse } from '../../response'
import validate from '../../validate'

const { constants, user } = sakiewkaCrypto

const register = async (req: Request, res: Response) => {
  const validationErrors = validate(req, registerRequest)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const { login, password } = req.body
  const backendResponse = await user.register(login, password)

  jsonResponse(res, backendResponse)
}

export default register
