import { Request, Response } from 'express'

import { constants, KeyModule, EosKeyModule } from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../../response'
import { decryptKeyRequest } from '../../../models'
import validate from '../../../validate'

const decryptKey = (key: KeyModule | EosKeyModule) => async (
  req: Request,
  res: Response
) => {
  const { errors, body } = validate(req, decryptKeyRequest)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }

  const decryptedKeyPair = key.decryptKeyPair(body.keyPair, body.passphrase)

  jsonResponse(res, { keyPair: decryptedKeyPair })
}

export default decryptKey
