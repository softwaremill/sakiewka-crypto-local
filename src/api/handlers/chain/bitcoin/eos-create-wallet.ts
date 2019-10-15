import { Request, Response } from 'express'
import { constants, EosWalletApi } from 'sakiewka-crypto'
import { errorResponse, jsonResponse } from '../../../response'
import { eosCreateWalletRequest } from '../../../models'
import validate from '../../../validate'

const eosCreateWallet = (wallet: EosWalletApi) => async (
  req: Request,
  res: Response
) => {
  const { errors, body } = validate(req, eosCreateWalletRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }

  const token = req.header('authorization') || ''
  const { passphrase, userPubKey, backupPubKey, name, eosAccountName } = body
  const walletData = await wallet.createWallet(token, {
    passphrase,
    userPubKey,
    backupPubKey,
    name,
    eosAccountName
  })

  jsonResponse(res, walletData)
}

export default eosCreateWallet
