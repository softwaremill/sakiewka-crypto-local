import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { registerRequest } from '../models'
import { jsonResponse, errorResponse } from '../response'
import validate from '../validate'

const { constants, backendApi, crypto } = sakiewkaCrypto

const register = async (req: Request, res: Response) => {
  const validationErrors = validate(req, registerRequest)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const { login, password } = req.body

  const backendResponse = await backendApi.register(login, crypto.hashSha512(password))

  // TODO: check if there was no errors during backend request
  jsonResponse(res, backendResponse)
}

export default register
