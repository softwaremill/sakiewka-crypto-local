import { Request, Response } from 'express'

import { constants } from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../../response'
import { decryptKeyRequest } from '../../../models'
import validate from '../../../validate'

const decryptKey = (sakiewkaModule) => async (req: Request, res: Response) => {
  const { key } = sakiewkaModule
  const { errors, body } = validate(req, decryptKeyRequest)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }

  const decryptedKeyPair = key.decryptKeyPair(body.keyPair, body.passphrase)

  jsonResponse(res, { keyPair: decryptedKeyPair })
}

export default decryptKey
