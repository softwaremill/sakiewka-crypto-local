import { Request, Response } from 'express'

import { errorResponse, jsonResponse } from '../../response'
import { listWalletsRequest } from '../../models'
import validate from '../../validate'
import sakiewkaCrypto, { Currency } from 'sakiewka-crypto'

const listWallets = (currency: Currency) => async (req: Request, res: Response) => {
  const { constants } = sakiewkaCrypto
  const { wallet } = sakiewkaCrypto[currency]

  const validationErrors = validate(req, listWalletsRequest, true)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const backendResponse = await wallet.listWallets(
    req.header('authorization'), req.query.limit, req.query.nextPageToken
  )

  jsonResponse(res, backendResponse)
}

export default listWallets
