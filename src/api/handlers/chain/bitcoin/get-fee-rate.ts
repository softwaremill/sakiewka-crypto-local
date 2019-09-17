import { Request, Response } from 'express'

import { jsonResponse } from '../../../response'
import { FeeRatesApi } from 'sakiewka-crypto'

const getFeeRate = (feeRates: FeeRatesApi) => async (
  req: Request,
  res: Response
) => {
  const feeRate = await feeRates.getFeeRate()
  jsonResponse(res, feeRate)
}

export default getFeeRate
