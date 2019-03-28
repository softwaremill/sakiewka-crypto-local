import { Request } from 'express'
import { ValidationErrorItem } from 'joi'
import { RequestModel } from '../types/api'

export default (request: Request, model: RequestModel, authRequired?: boolean) => {
  const errors: string[] = []

  const bodyResult = model.body && model.body.validate(request.body)
  const queryResult = model.query && model.query.validate(request.query)

  if (bodyResult && bodyResult.error) {
    bodyResult.error.details.forEach((err: ValidationErrorItem) => {
      errors.push(err.message)
    })
  }

  if (queryResult && queryResult.error) {
    queryResult.error.details.forEach((err: ValidationErrorItem) => {
      errors.push(err.message)
    })
  }

  if (authRequired && !request.rawHeaders.includes('Authorization')) {
    return { errors: ['Request header Authorization is required.'] }
  }

  const body = bodyResult ? bodyResult.value : undefined
  const queryParams = queryResult ? queryResult.value : undefined
  return { errors, body, queryParams }
}
