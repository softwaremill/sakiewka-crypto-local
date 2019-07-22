import { Response } from 'express'

import { ApiError } from 'sakiewka-crypto'

export const jsonResponse = (res: Response, data: object) => {
  const body = {
    data,
    status: 'success'
  }

  res.json(body)
}

export const errorResponse = (res: Response, error: ApiError, customMessage?: string, errorId?: string) => {
  if (customMessage) error.errors = [{ message: customMessage, code: '' }]

  const body = {
    errorId: errorId,
    errors: error.errors,
    status: 'error'
  }

  res.status(error.code || 400)
  res.json(body)
}
