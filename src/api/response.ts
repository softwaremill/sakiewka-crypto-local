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
  const errors = [...error.errors]

  if (customMessage) {
    errors[0].message = customMessage
  }

  const body = {
    errorId,
    errors,
    status: 'error'
  }

  res.status(error.code || 400)
  res.json(body)
}
