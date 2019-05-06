import { Request, Response } from 'express'

import { errorResponse, jsonResponse } from '../../../response'
import { listPolicyRequest } from '../../../models'
import validate from '../../../validate'
import { constants, Currency } from 'sakiewka-crypto'

const listPolicies = (sakiewkaCrypto, currency: Currency) => async (req: Request, res: Response) => {
  const { policy } = sakiewkaCrypto[currency]
  const { errors, queryParams } = validate(req, listPolicyRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }

  const backendResponse = await policy.listPolicies(req.header('authorization'), queryParams.limit, queryParams.nextPageToken)

  jsonResponse(res, backendResponse)
}

export default listPolicies
