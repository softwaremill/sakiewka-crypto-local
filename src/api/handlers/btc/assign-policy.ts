import { Request, Response } from 'express'

import { errorResponse, jsonResponse } from '../../response'
import { assignPolicyRequest } from '../../models'
import validate from '../../validate'
import { Currency, constants } from 'sakiewka-crypto'

const assignPolicy = (sakiewkaApi, currency: Currency) => async (req: Request, res: Response) => {
  const { policy } = sakiewkaApi[currency]
  const { errors, body } = validate(req, assignPolicyRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }

  const token = req.header('authorization')
  const response = await policy.assignPolicy(token, req.params.policyId, body.walletId)

  jsonResponse(res, response)
}

export default assignPolicy
