import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../response'
import { resendVerificationEmailRequest } from '../../models'
import validate from '../../validate'

const { user, constants } = sakiewkaCrypto

const resendVerificationEmail = async (req: Request, res: Response) => {
  const validationErrors = validate(req, resendVerificationEmailRequest, false)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }
  const { email } = req.body
  const backendResponse = await user.resendVerificationEmail(email)

  jsonResponse(res, backendResponse)
}

export default resendVerificationEmail
