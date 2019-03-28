import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../../response'
import { listUtxoRequest } from '../../models'
import validate from '../../validate'
import sakiewkaCrypto , {Currency} from 'sakiewka-crypto'


const listUtxo = (currency: Currency) => async (req: Request, res: Response) => {
  const { constants } = sakiewkaCrypto
  const { wallet } = sakiewkaCrypto[currency]

  const { errors, body } = validate(req, listUtxoRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, errors[0])
  }
  const { feeRateSatoshi, recipients } = body
  const backendResponse = await wallet.listUnspents(
    req.header('authorization'), req.param('walletId'), feeRateSatoshi, recipients
  )

  jsonResponse(res, backendResponse)
}

export default listUtxo
