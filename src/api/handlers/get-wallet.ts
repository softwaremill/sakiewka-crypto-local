import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../response'
import { getWalletRequest } from '../models'
import sakiewkaCrypto from 'sakiewka-crypto'
import validate from '../validate'

const { backendApi, constants } = sakiewkaCrypto

const getWallet = async (req: Request, res: Response) => {
  const validationErrors = validate(req, getWalletRequest)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const backendResponse = await backendApi.getWallet(
    req.header('authorization'), req.params.id
  )

  // TODO: check if there was no errors during backend request
  jsonResponse(res, { ...backendResponse })
}

export default getWallet
