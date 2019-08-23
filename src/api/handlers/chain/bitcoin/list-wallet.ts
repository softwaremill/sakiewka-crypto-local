import { Request, Response } from 'express'

import { errorResponse, jsonResponse } from '../../../response'
import { listWalletsRequest } from '../../../models'
import validate from '../../../validate'
import { constants, EosWalletApi, BitcoinWalletApi } from 'sakiewka-crypto'

const listWallets = (wallet: BitcoinWalletApi | EosWalletApi) => async (
  req: Request,
  res: Response
) => {
  const { errors, queryParams } = validate(req, listWalletsRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }

  const backendResponse = await wallet.listWallets(
    req.header('authorization') || '',
    queryParams.limit,
    queryParams.searchPhrase,
    queryParams.nextPageToken
  )

  jsonResponse(res, backendResponse)
}

export default listWallets
