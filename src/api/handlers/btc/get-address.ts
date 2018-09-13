import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../response'
import { getAddressRequest } from '../../models'
import validate from '../../validate'

const { constants, address } = sakiewkaCrypto

const getWallet = async (req: Request, res: Response) => {
  const validationErrors = validate(req, getAddressRequest, true)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const token = req.header('authorization')
  const addressData = await address.getAddress(
    token, req.param('walletId'), req.param('address')
  )

  // TODO: check if there was no errors during backend request
  jsonResponse(res, addressData)
}

export default getWallet
