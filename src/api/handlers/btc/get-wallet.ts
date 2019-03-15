import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../../response'
import { getWalletRequest } from '../../models'
import validate from '../../validate'
import sakiewkaCrypto , {Currency} from 'sakiewka-crypto'


const getWallet = (currency: Currency) => async (req: Request, res: Response) => {
  const { wallet } = sakiewkaCrypto[currency]
  const { constants } = sakiewkaCrypto

  const validationErrors = validate(req, getWalletRequest, true)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const backendResponse = await wallet.getWallet(
    req.header('authorization'), req.params.id
  )

  jsonResponse(res, backendResponse)
}

export default getWallet
