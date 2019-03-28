import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../response'
import { logoutRequest } from '../../models'
import validate from '../../validate'

const { constants } = sakiewkaCrypto

const info = async (req: Request, res: Response) => {
  const { errors } = validate(req, logoutRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }

  jsonResponse(res, {})
}

export default info
