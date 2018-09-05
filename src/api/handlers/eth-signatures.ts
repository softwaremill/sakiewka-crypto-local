import { Request, Response } from 'express'

import sakiewkaCrypto from 'sakiewka-crypto'
import { jsonResponse, errorResponse } from '../response'
import { signEthWalletWithdrawalRequest } from '../models'
import validate from '../validate'

const { constants, ethereum } = sakiewkaCrypto

const ethSign = async (req: Request, res: Response) => {
  const validationErrors = validate(req, signEthWalletWithdrawalRequest, true)

  if (validationErrors.length > 0) {
    return errorResponse(res, constants.API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const { pk, address, amount, data, expireTime, contractNonce } = req.body

  const operationHash = ethereum.createETHOperationHash(
    address, amount, data, expireTime, contractNonce
  );

  const signature = ethereum.createSignature(operationHash, pk);

  // TODO: check if there was no errors during backend request
  jsonResponse(res, signature)
}

export default ethSign
