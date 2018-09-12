import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../response'
import { createWalletRequest } from '../../models'
import validate from '../../validate'

const { constants, wallet } = sakiewkaCrypto

const crateWallet = async (req: Request, res: Response) => {
  const validationErrors = validate(req, createWalletRequest, true)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const token = req.header('authorization')
  const { passphrase, userPubKey, backupPubKey, name } = req.body
  const walletData = await wallet.createWallet(
    token, { passphrase, userPubKey, backupPubKey, name }
  )

  // TODO: check if there was no errors during backend request
  jsonResponse(res, walletData)
}

export default crateWallet
