import { Request, Response } from 'express'

import { errorResponse, jsonResponse } from '../../../response'
import { listUtxosByAddressRequest } from '../../../models'
import validate from '../../../validate'
import { constants, BitcoinWalletApi } from 'sakiewka-crypto'

const listUtxosByAddress = (wallet: BitcoinWalletApi) => async (
  req: Request,
  res: Response
) => {
  const { errors, queryParams } = validate(
    req,
    listUtxosByAddressRequest,
    true
  )

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }

  const backendResponse = await wallet.listUtxosByAddress(
    req.header('authorization') || '',
    req.param('walletId'),
    req.param('address'),
    queryParams.limit,
    queryParams.nextPageToken
  )

  jsonResponse(res, backendResponse)
}

export default listUtxosByAddress
