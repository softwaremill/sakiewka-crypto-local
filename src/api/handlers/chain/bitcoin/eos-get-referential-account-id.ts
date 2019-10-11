import { Request, Response } from 'express'

import { constants, AccountFeeApi } from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../../response'
import validate from '../../../validate'

const eosGetReferentialAccountId = (accountFeeApi: AccountFeeApi) => async (req: Request, res: Response) => {
  const { errors } = validate(req, {}, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }

  const token = req.header('authorization') || ''
  const backendResponse = await accountFeeApi.getReferentialAccountId(token)

  jsonResponse(res, backendResponse)
}

export default eosGetReferentialAccountId