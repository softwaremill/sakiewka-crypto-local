import { Request, Response } from 'express'
import { AddressApi, constants } from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../../response'
import { getAddressRequest } from '../../../models'
import validate from '../../../validate'

const getWallet = (address: AddressApi) => async (
  req: Request,
  res: Response
) => {
  const { errors } = validate(req, getAddressRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }

  const token = req.header('authorization') || ''
  const addressData = await address.getAddress(
    token,
    req.param('walletId'),
    req.param('address')
  )

  jsonResponse(res, addressData)
}

export default getWallet
