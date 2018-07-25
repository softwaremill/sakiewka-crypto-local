import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../response'
import { createWalletRequest } from '../models'
import validate from '../validate'

const { backendApi, constants, wallet, utils } = sakiewkaCrypto

const crateWallet = async (req: Request, res: Response) => {
  const validationErrors = validate(req, createWalletRequest)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const { passphrase, userPubKey, backupPubKey, label } = req.body
  const keypairs = wallet.prepareKeypairs({ passphrase, userPubKey, backupPubKey })

  const token = req.header('authorization')

  const backendRequestParams = utils.helpers.filterObject(
    {
      label,
      userPubKey: keypairs.user.pubKey,
      userPrivKey: keypairs.user.privKey,
      backupPubKey: keypairs.backup.pubKey,
      backupPrivKey: keypairs.backup.privKey
    },
    (value: any) => value
  )

  const backendResponse = await backendApi.createWallet(token, backendRequestParams)

  // TODO: check if there was no errors during backend request
  jsonResponse(res, { ...backendResponse })
}

export default crateWallet
