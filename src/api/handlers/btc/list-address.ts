import { Request, Response } from 'express'

import { errorResponse, jsonResponse } from '../../response'
import { listAddressesRequest } from '../../models'
import validate from '../../validate'
import sakiewkaCrypto, { Currency } from 'sakiewka-crypto'


const listAddresses = (currency: Currency) => async (req: Request, res: Response) => {
  const { constants } = sakiewkaCrypto
  const { address } = sakiewkaCrypto[currency]

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
