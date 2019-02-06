import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../response'
import { monthlySummaryRequest } from '../../models'
import validate from '../../validate'

const { user, constants } = sakiewkaCrypto

export default async (req: Request, res: Response) => {
  const validationErrors = validate(req, monthlySummaryRequest, true)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const token = req.header('authorization')
  const backendResponse = await user.monthlySummary(token,req.params.month,req.params.year,req.params.fiatCurrency)

  jsonResponse(res, backendResponse)
}
