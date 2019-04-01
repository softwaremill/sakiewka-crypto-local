import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { errorResponse, jsonResponse } from '../../response'
import { loginRequest } from '../../models'
import validate from '../../validate'

const { constants, user } = sakiewkaCrypto

const login = async (req: Request, res: Response) => {
  const { errors, body } = validate(req, loginRequest)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }

  const { login, password, code } = body
  const backendResponse = await user.login(login, password, code)

  jsonResponse(res, backendResponse)
}

export default login
