import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../../response'
import { listUtxoRequest } from '../../models'
import sakiewkaCrypto from 'sakiewka-crypto'
import validate from '../../validate'

const { constants, wallet } = sakiewkaCrypto

const listUtxo = async (req: Request, res: Response) => {
  const validationErrors = validate(req, listUtxoRequest, true)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const backendResponse = await wallet.listUnspents(
    req.header('authorization'), req.param('walletId'), req.query.amountBtc, req.query.feeRateSatoshi
  )

  // TODO: check if there was no errors during backend request
  jsonResponse(res, backendResponse)
}

export default listUtxo
