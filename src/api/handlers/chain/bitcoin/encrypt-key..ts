import { Request, Response } from 'express'

import { constants, KeyModule, EosKeyModule } from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../../../response'
import { encryptKeyRequest } from '../../../models'
import validate from '../../../validate'

const encryptKey = (key: KeyModule | EosKeyModule) => async (
  req: Request,
  res: Response
) => {
  const { errors, body } = validate(req, encryptKeyRequest)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }

  const encryptedKeyPair = key.encryptKeyPair(body.keyPair, body.passphrase)
  jsonResponse(res, { keyPair: encryptedKeyPair })
}

export default encryptKey
