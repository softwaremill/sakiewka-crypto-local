import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../response'
import { getKeyRequest } from '../../models'
import validate from '../../validate'

const { constants, key } = sakiewkaCrypto

const getKey = async (req: Request, res: Response) => {
  const validationErrors = validate(req, getKeyRequest, true)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const token = req.header('authorization')
  const addressData = await key.getKey(
    token, req.param('id'), req.query.includePrivate
  )

  jsonResponse(res, addressData)
}

export default getKey
