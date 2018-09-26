import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../../response'
import { listAddressesRequest } from '../../models'
import sakiewkaCrypto from 'sakiewka-crypto'
import validate from '../../validate'

const { constants, address } = sakiewkaCrypto

const listAddresses = async (req: Request, res: Response) => {
  const validationErrors = validate(req, listAddressesRequest, true)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const backendResponse = await address.listAddresses(
    req.header('authorization'), req.param('walletId'), req.query.limit, req.query.nextPageToken
  )

  jsonResponse(res, backendResponse)
}

export default listAddresses
