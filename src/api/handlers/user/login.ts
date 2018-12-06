import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { errorResponse, jsonResponse } from '../../response'
import { loginRequest } from '../../models'
import validate from '../../validate'

const { constants, user } = sakiewkaCrypto

const login = async (req: Request, res: Response) => {
  const validationErrors = validate(req, loginRequest)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const { login, password } = req.body
  const backendResponse = await user.login(login, password)

  jsonResponse(res, backendResponse)
}

export default login
