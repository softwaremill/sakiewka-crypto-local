import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../response'
import { sendEthRequest, sendTokensRequest } from '../../models'
import validate from '../../validate'

const { transactionEth, constants } = sakiewkaCrypto

export const sendEth = async (req: Request, res: Response) => {
  const validationErrors = validate(req, sendEthRequest, true)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const token = req.header('authorization')
  const { address, amount, data } = req.body
  const prvKey = req.body.prvKey || process.env.PRV_KEY

  if (!prvKey) return errorResponse(res, constants.API_ERROR.BAD_REQUEST, '"prvKey" is required')

  const status = await transactionEth.sendETH(
    token, prvKey, address, amount, data
  );

  jsonResponse(res, status)
}

export const sendTokens = async (req: Request, res: Response) => {
  const validationErrors = validate(req, sendTokensRequest, true)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const token = req.header('authorization')
  const { address, amount, contractAddress } = req.body
  const prvKey = req.body.prvKey || process.env.PRV_KEY

  if (!prvKey) return errorResponse(res, constants.API_ERROR.BAD_REQUEST, '"prvKey" is required')

  const status = await transactionEth.sendToken(
    token, prvKey, address, contractAddress, amount
  );

  jsonResponse(res, status)
}
