import { Request, Response } from 'express'

import { constantss } from 'sakiewka-crypto'
import { errorResponse } from '../response'

const notFound = (req: Request, res: Response) => {
  errorResponse(res, constantss.API_ERROR.NOT_FOUND)
}

export default notFound
