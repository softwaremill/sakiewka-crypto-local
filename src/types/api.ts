import { ObjectSchema } from 'joi'

export interface RequestModel {
  body?: ObjectSchema,
  query?: ObjectSchema
}
