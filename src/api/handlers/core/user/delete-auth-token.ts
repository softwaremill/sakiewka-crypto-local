import { Request, Response } from 'express'
import { UserApi } from 'sakiewka-crypto'
import { jsonResponse } from '../../../response'

export const deleteAuthToken = (user: UserApi) => async (
  req: Request,
  res: Response
) => {
  const token = req.header('authorization') || ''
  const backendResponse = await user.deleteAuthToken(token)

  jsonResponse(res, backendResponse)
}

export default deleteAuthToken
