import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { errorResponse } from '../response'

const notFound = async (req: Request, res: Response) => {
  errorResponse(res, sakiewkaCrypto.constants.API_ERROR.NOT_FOUND)
}

export default notFound
