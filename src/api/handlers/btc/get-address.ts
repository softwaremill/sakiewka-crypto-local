import { Request, Response } from 'express'

import sakiewkaCrypto , {Currency} from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../response'
import { getAddressRequest } from '../../models'
import validate from '../../validate'

const getWallet = (currency: Currency) => async (req: Request, res: Response) => {
  const { address } = sakiewkaCrypto[currency]
  const { constants } = sakiewkaCrypto
  const validationErrors = validate(req, getAddressRequest, true)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const token = req.header('authorization')
  const addressData = await address.getAddress(
    token, req.param('walletId'), req.param('address')
  )

  jsonResponse(res, addressData)
}

export default getWallet
