import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../../response'
import { getWalletRequest } from '../../models'
import validate from '../../validate'
import { Currency, constants } from 'sakiewka-crypto'


const getWallet = (sakiewkaCrypto, currency: Currency) => async (req: Request, res: Response) => {
  const { wallet } = sakiewkaCrypto[currency]
  const { errors } = validate(req, getWalletRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }

  const backendResponse = await wallet.getWallet(
    req.header('authorization'), req.params.id
  )

  jsonResponse(res, backendResponse)
}

export default getWallet
