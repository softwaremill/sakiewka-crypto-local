import { Request } from 'express'
import { ObjectSchema, ValidationError } from 'joi'

export default (request: Request, model: ObjectSchema, authRequired?: boolean) => {
  const { error } = model.validate(request.body)

  if (error) return error.details.map((err: ValidationError) => err.message)

  if (authRequired && !request.rawHeaders.includes('Authorization')) {
    return ['Request header Authorization is required.']
  }

  return []
}
