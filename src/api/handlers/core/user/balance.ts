import { Request, Response } from 'express'

import { constants, UserApi } from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../../response'
import { balanceRequest } from '../../../models'
import validate from '../../../validate'

export const balance = (user: UserApi) => async (
  req: Request,
  res: Response
) => {
  const { errors, body } = validate(req, balanceRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }

  const token = req.header('authorization') || ''
  const { fiatCurrency } = body
  const backendResponse = await user.balance(token, fiatCurrency)

  jsonResponse(res, backendResponse)
}
