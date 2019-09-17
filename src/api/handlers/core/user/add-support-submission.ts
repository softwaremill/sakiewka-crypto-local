import { Request, Response } from 'express'

import { constants, UserApi } from 'sakiewka-crypto'
import { errorResponse, jsonResponse } from '../../../response'
import { addSupportSubmissionRequest } from '../../../models'
import validate from '../../../validate'

export const addSupportSubmission = (user: UserApi) => async (
  req: Request,
  res: Response
) => {
  const { errors, body } = validate(req, addSupportSubmissionRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }
  const { subject, content } = body
  const token = req.header('authorization') || ''
  const backendResponse = await user.addSupportSubmission(
    token,
    subject,
    content
  )

  jsonResponse(res, backendResponse)
}

export default addSupportSubmission
