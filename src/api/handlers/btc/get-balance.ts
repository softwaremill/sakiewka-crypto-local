import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../../response'
import { getBalanceRequest } from '../../models'
import validate from '../../validate'
import { Currency, constants } from 'sakiewka-crypto'

const getBalance = (sakiewkaCrypto, currency: Currency) => async (req: Request, res: Response) => {
  const { wallet } = sakiewkaCrypto[currency]

  const { errors } = validate(req, getBalanceRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }

  const token = req.header('authorization')
  const backendResponse = await wallet.getWalletBalance(
    token, req.param('walletId')
  )

  jsonResponse(res, backendResponse)
}

export default getBalance
