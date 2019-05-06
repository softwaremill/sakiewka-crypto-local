import { Request, Response } from 'express'

import { errorResponse, jsonResponse } from '../../response'
import { listWalletsForPolicyRequest } from '../../models'
import validate from '../../validate'
import { constants, Currency } from 'sakiewka-crypto'

const listWalletsForPolicy = (sakiewkaCrypto, currency: Currency) => async (req: Request, res: Response) => {
  const { policy } = sakiewkaCrypto[currency]
  const { errors } = validate(req, listWalletsForPolicyRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }

  const backendResponse = await policy.listWalletsForPolicy(req.header('authorization'), req.params.policyId)

  jsonResponse(res, backendResponse)
}

export default listWalletsForPolicy
