import { Request, Response } from 'express'

import { errorResponse, jsonResponse } from '../../../response'
import { listPoliciesForWalletRequest } from '../../../models'
import validate from '../../../validate'
import { constants, BitcoinWalletApi, EosWalletApi } from 'sakiewka-crypto'

const listPoliciesForWallet = (
  wallet: BitcoinWalletApi | EosWalletApi
) => async (req: Request, res: Response) => {
  const { errors } = validate(req, listPoliciesForWalletRequest, true)

  if (errors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST(errors[0]))
  }

  const backendResponse = await wallet.listPoliciesForWallet(
    req.header('authorization') || '',
    req.params.walletId
  )

  jsonResponse(res, backendResponse)
}

export default listPoliciesForWallet
