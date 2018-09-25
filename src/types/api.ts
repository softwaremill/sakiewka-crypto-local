import { ObjectSchema } from 'joi'

export interface ApiError {
  code: number,
  message: string
}

export interface RequestModel {
  body?: ObjectSchema,
  query?: ObjectSchema
}
