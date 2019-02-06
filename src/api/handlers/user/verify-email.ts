import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../response'
import {verifyEmailRequest } from '../../models'
import validate from '../../validate'

const { user, constants } = sakiewkaCrypto

const verifyEmail = async (req: Request, res: Response) => {
  const validationErrors = validate(req, verifyEmailRequest, false)
  
  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }
  const { code, email } = req.query
  const backendResponse = await user.verifyEmail(code, email)

  jsonResponse(res, backendResponse)
}

export default verifyEmail
