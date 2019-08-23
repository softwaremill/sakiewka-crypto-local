import { Request, Response } from 'express'
import { BitcoinWalletApi, constants, EosWalletApi } from 'sakiewka-crypto'
import { errorResponse, jsonResponse } from '../../../response'
import { createWalletRequest } from '../../../models'
import validate from '../../../validate'

const crateWallet = (wallet: BitcoinWalletApi | EosWalletApi) => async (
  req: Request,
  res: Response
) => {
  const { errors, body } = validate(req, createWalletRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }

  const token = req.header('authorization') || ''
  const { passphrase, userPubKey, backupPubKey, name } = body
  const walletData = await wallet.createWallet(token, {
    passphrase,
    userPubKey,
    backupPubKey,
    name
  })

  jsonResponse(res, walletData)
}

export default crateWallet
