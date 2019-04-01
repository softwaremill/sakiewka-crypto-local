import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { errorResponse, jsonResponse } from '../../response'
import { confirm2faRequest } from '../../models'
import validate from '../../validate'

const { constants, user } = sakiewkaCrypto

const confirm2fa = async (req: Request, res: Response) => {
  const { errors, body } = validate(req, confirm2faRequest)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }

  const { password, code } = body
  const token = req.header('authorization')
  const backendResponse = await user.confirm2fa(token, password, code)

  jsonResponse(res, backendResponse)
}

export default confirm2fa
