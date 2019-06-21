import { Request, Response } from 'express'

import { jsonResponse } from '../../../response'

export const deleteAuthToken = (sakiewkaCrypto) => async (req: Request, res: Response) => {
  const token = req.header('authorization')
  const backendResponse = await sakiewkaCrypto.user.deleteAuthToken(token)

  jsonResponse(res, backendResponse)
}

export default deleteAuthToken
