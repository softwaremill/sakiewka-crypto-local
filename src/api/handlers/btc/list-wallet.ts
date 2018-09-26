import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../../response'
import { listWalletsRequest } from '../../models'
import sakiewkaCrypto from 'sakiewka-crypto'
import validate from '../../validate'

const { constants, wallet } = sakiewkaCrypto

const listWallets = async (req: Request, res: Response) => {
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
