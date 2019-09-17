import { Response } from 'express'

import { ApiError } from 'sakiewka-crypto'

export const jsonResponse = (res: Response, data: any) => {
  const body = {
    data,
    status: 'success'
  }

  res.json(body)
}

export const errorResponse = (
  res: Response,
  error: ApiError,
  errorId?: string
) => {
  res.status(error.code || 500)
  res.json({
    error: {
      id: errorId
    },
    ...error
  })
}
