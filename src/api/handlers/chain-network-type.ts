import { Request, Response } from 'express'

import { jsonResponse } from '../response'
import { SakiewkaBackend } from 'sakiewka-crypto'

const chainNetworkType = (backendApi: SakiewkaBackend) => async (
  req: Request,
  res: Response
) => {
  const response = await backendApi.core.chainNetworkType()

  jsonResponse(res, response)
}

export default chainNetworkType
