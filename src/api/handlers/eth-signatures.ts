import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../response'
import { signEthWalletWithdrawalRequest, signTokenWalletWithdrawalRequest } from '../models'
import validate from '../validate'

const { transactionEth, constants } = sakiewkaCrypto

export const ethSign = async (req: Request, res: Response) => {
  const validationErrors = validate(req, signEthWalletWithdrawalRequest, false)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const { pk, address, amount, data, expireTime, contractNonce } = req.body

  const signature = transactionEth.signETHTransaction(
    address, amount, data, expireTime, contractNonce, pk
  );

  jsonResponse(res, signature)
}

export const tokenSign = async (req: Request, res: Response) => {
  const validationErrors = validate(req, signTokenWalletWithdrawalRequest, false)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const { pk, address, amount, contractAddress, expireTime, contractNonce } = req.body

  const signature = transactionEth.signTokenTransaction(
    address, amount, contractAddress, expireTime, contractNonce, pk
  );

  jsonResponse(res, signature)
}
