import { Request, Response } from 'express'

import { errorResponse, jsonResponse } from '../../response'
import { createNewAddressRequest } from '../../models'
import validate from '../../validate'
import sakiewkaCrypto, { Currency } from 'sakiewka-crypto'

const createNewAddress = (currency: Currency) => async (req: Request, res: Response) => {
  const { address } = sakiewkaCrypto[currency]
  const { constants } = sakiewkaCrypto

  const { errors, body } = validate(req, createNewAddressRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }

  const token = req.header('authorization')
  const newAddress = await address.createNewAddress(token, req.param('walletId'), body.name)

  jsonResponse(res, newAddress)
}

export default createNewAddress
