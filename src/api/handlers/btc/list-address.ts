import { Request, Response } from 'express'

import { errorResponse, jsonResponse } from '../../response'
import { listAddressesRequest } from '../../models'
import validate from '../../validate'
import sakiewkaCrypto, { Currency } from 'sakiewka-crypto'


const listAddresses = (currency: Currency) => async (req: Request, res: Response) => {
  const { constants } = sakiewkaCrypto
  const { address } = sakiewkaCrypto[currency]

  const { errors, queryParams } = validate(req, listAddressesRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }

  const backendResponse = await address.listAddresses(
    req.header('authorization'), req.param('walletId'), queryParams.limit, queryParams.nextPageToken
  )

  jsonResponse(res, backendResponse)
}

export default listAddresses
