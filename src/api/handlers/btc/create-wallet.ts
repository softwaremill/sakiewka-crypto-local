import { Request, Response } from 'express'

import sakiewkaCrypto, { Currency } from 'sakiewka-crypto'

import { errorResponse, jsonResponse } from '../../response'
import { createWalletRequest } from '../../models'
import validate from '../../validate'


const crateWallet = (currency: Currency) => async (req: Request, res: Response) => {
  const { constants } = sakiewkaCrypto
  const { wallet } = sakiewkaCrypto[currency];

  const validationErrors = validate(req, createWalletRequest, true)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const token = req.header('authorization')
  const { passphrase, userPubKey, backupPubKey, name } = req.body
  const walletData = await wallet.createWallet(
    token, { passphrase, userPubKey, backupPubKey, name }
  )

  jsonResponse(res, walletData)
}

export default crateWallet
