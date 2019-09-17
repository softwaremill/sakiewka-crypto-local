import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../../../response'
import { getKeyRequest } from '../../../models'
import validate from '../../../validate'
import { KeyApi, constants } from 'sakiewka-crypto'

const getKey = (key: KeyApi) => async (req: Request, res: Response) => {
  const { errors, queryParams } = validate(req, getKeyRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }

  const token = req.header('authorization') || ''
  const addressData = await key.getKey(
    token,
    req.param('id'),
    queryParams.includePrivate
  )

  jsonResponse(res, addressData)
}

export default getKey
