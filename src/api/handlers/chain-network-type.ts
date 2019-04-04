import { Request, Response } from 'express'

import { jsonResponse } from '../response'

const chainNetworkType = (backendApi) => async (req: Request, res: Response) => {
  const response = await backendApi.core.chainNetworkType()

  jsonResponse(res, response)
}

export default chainNetworkType