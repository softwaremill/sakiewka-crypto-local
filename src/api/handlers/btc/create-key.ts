import { Request, Response } from 'express'

import sakiewkaCrypto , {Currency} from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../response'
import { createKeyRequest } from '../../models'
import validate from '../../validate'

const createKey = (currency: Currency) => async (req: Request, res: Response) => {
  const { constants } = sakiewkaCrypto
  const { key } = sakiewkaCrypto[currency]

  const { errors, body } = validate(req, createKeyRequest)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }

  const newKeyPair = key.generateNewKeyPair()

  if (body.passphrase) {
    const encryptedKeyPair = key.encryptKeyPair(newKeyPair, body.passphrase)
    return jsonResponse(res, { keyPair: encryptedKeyPair })
  }

  jsonResponse(res, { keyPair: newKeyPair })
}

export default createKey
