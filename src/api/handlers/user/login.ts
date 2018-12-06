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

  const { login, password: hashedPassword } = req.body
  if (hashedPassword.length !== 64) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, `Invalid length of password, expected: 64, got: ${hashedPassword.length}`)
  }

  const backendResponse = await user.login(login, hashedPassword)

  jsonResponse(res, backendResponse)
}

export default login
