import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../response'
import { getBalanceRequest } from '../../models'
import validate from '../../validate'

const { constants, wallet } = sakiewkaCrypto

const getBalance = async (req: Request, res: Response) => {
  const validationErrors = validate(req, getBalanceRequest, true)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const token = req.header('authorization')
  const backendResponse = await wallet.getWalletBalance(
    token, req.param('walletId')
  )

  // TODO: check if there was no errors during backend request
  jsonResponse(res, backendResponse)
}

export default getBalance
