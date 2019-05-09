import { Request, Response } from 'express'

import { jsonResponse } from '../../../response'
import { Currency } from 'sakiewka-crypto'

const getFeeRate = (sakiewkaCrypto, currency: Currency) => async (req: Request, res: Response) => {
  const { feeRates } = sakiewkaCrypto[currency]

  const feeRate = await feeRates.getFeeRate()
  jsonResponse(res, feeRate)
}

export default getFeeRate
