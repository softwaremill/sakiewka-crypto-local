import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../response'
import { createKeyRequest } from '../models'
import validate from '../validate'

const { backendApi, constants, wallet } = sakiewkaCrypto

const createKey = async (req: Request, res: Response) => {
  const validationErrors = validate(req, createKeyRequest)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const newKeypair = wallet.generateNewKeypair()

  if (req.body.passphrase) {
    const encryptedKeypair = wallet.encryptKeyPair(newKeypair, req.body.passphrase)
    return jsonResponse(res, { keypair: encryptedKeypair })
  }

  jsonResponse(res, { keypair: newKeypair })
}

export default createKey
