import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../response'
import { createKeyRequest } from '../../models'
import validate from '../../validate'

const { constants, key } = sakiewkaCrypto

const createKey = async (req: Request, res: Response) => {
  const validationErrors = validate(req, createKeyRequest)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const newKeyPair = key.generateNewKeyPair()

  if (req.body.passphrase) {
    const encryptedKeyPair = key.encryptKeyPair(newKeyPair, req.body.passphrase)
    return jsonResponse(res, { keyPair: encryptedKeyPair })
  }

  jsonResponse(res, { keyPair: newKeyPair })
}

export default createKey
