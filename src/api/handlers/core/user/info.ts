import { Request, Response } from 'express'

import { constants, UserApi } from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../../response'
import { infoRequest } from '../../../models'
import validate from '../../../validate'

export const info = (user: UserApi) => async (req: Request, res: Response) => {
  const { errors } = validate(req, infoRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }

  const token = req.header('authorization') || ''
  const backendResponse = await user.info(token)

  jsonResponse(res, backendResponse)
}
