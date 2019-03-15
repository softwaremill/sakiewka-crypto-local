import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../../response'
import { sendTransactionRequest } from '../../models'
import validate from '../../validate'
import { BigNumber } from "bignumber.js";
import sakiewkaCrypto , {Currency} from 'sakiewka-crypto'


const sendCoins = (currency: Currency) => async (req: Request, res: Response) => {
  const { constants } = sakiewkaCrypto
  const { transaction } = sakiewkaCrypto[currency]

  const validationErrors = validate(req, sendTransactionRequest, true)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const backendResponse = await transaction.send(
    req.header('authorization'),
    req.params.walletId,
    req.body.recipients.map(e => ({ address: e.address, amount: new BigNumber(e.amount) })),
    req.body.xprv,
    req.body.passphrase
  )

  jsonResponse(res, backendResponse)
}

export default sendCoins
