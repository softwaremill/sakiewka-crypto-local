import { Request, Response } from 'express'

import { constants } from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../response'
import { monthlySummaryRequest } from '../../models'
import validate from '../../validate'

export const monthlySummary = (sakiewkaApi) => async (req: Request, res: Response) => {
  const { errors } = validate(req, monthlySummaryRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }

  const token = req.header('authorization')
  const backendResponse = await sakiewkaApi.transfers.monthlySummary(token, req.params.month, req.params.year, req.params.fiatCurrency)

  jsonResponse(res, backendResponse)
}
