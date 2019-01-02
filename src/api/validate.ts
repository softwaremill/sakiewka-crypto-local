import { Request } from 'express'
import { ValidationErrorItem } from 'joi'
import { RequestModel } from '../types/api'

export default (request: Request, model: RequestModel, authRequired?: boolean) => {
  const errors: string[] = []

  const bodyError = model.body && model.body.validate(request.body)
  const queryError = model.query && model.query.validate(request.query)

  if (bodyError && bodyError.error) {
    bodyError.error.details.forEach((err: ValidationErrorItem) => {
      errors.push(err.message)
    })
  }

  if (queryError && queryError.error) {
    queryError.error.details.forEach((err: ValidationErrorItem) => {
      errors.push(err.message)
    })
  }

  if (errors.length > 0) return errors

  if (authRequired && !request.rawHeaders.includes('Authorization')) {
    return ['Request header Authorization is required.']
  }

  return []
}
