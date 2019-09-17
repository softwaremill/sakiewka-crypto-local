import { Request, Response } from 'express'

import { errorResponse, jsonResponse } from '../../../response'
import { createNewPolicyRequest } from '../../../models'
import validate from '../../../validate'
import { constants, PolicyApi } from 'sakiewka-crypto'

const createNewPolicy = (policy: PolicyApi) => async (
  req: Request,
  res: Response
) => {
  const { errors, body } = validate(req, createNewPolicyRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }

  const token = req.header('authorization') || ''
  const response = await policy.createPolicy(
    token,
    body.name,
    body.policySettings
  )

  jsonResponse(res, response)
}

export default createNewPolicy
