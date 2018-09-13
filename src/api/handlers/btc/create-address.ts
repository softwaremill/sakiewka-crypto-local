import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../response'
import { createNewAddressRequest } from '../../models'
import validate from '../../validate'

const { constants, address } = sakiewkaCrypto

const createNewAddress = async (req: Request, res: Response) => {
  const validationErrors = validate(req, createNewAddressRequest, true)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const token = req.header('authorization')
  const newAddress = await address.createNewAddress(token, req.param('walletId'), req.body.name)

  jsonResponse(res, { ...newAddress })
}

export default createNewAddress
