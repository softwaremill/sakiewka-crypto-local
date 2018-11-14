import Joi, { SchemaMap } from 'joi'

const createSchema = (object: SchemaMap) => Joi.object().keys(object)

export const registerRequest = {
  body: createSchema({
    password: Joi.string().required(),
    login: Joi.string().required()
  })
}

export const loginRequest = {
  body: createSchema({
    password: Joi.string().required(),
    login: Joi.string().required()
  })
}

export const logoutRequest = {}

export const infoRequest = {}

export const createWalletRequest = {
  body: createSchema({
    name: Joi.string().required(),
    userPubKey: Joi.string(),
    backupPubKey: Joi.string(),
    passphrase: Joi.string().required()
  })
}

export const getWalletRequest = {}

export const listWalletsRequest = {
  query: createSchema({
    nextPageToken: Joi.string(),
    limit: Joi.string().required()
  })
}

export const getTransferRequest = {}

export const listTransfersRequest = {}

export const listUtxoRequest = {
  query: createSchema({
    amountBtc: Joi.string().required(),
    feeRateSatoshi: Joi.string().required()
  })
}

export const createKeyRequest = {
  body: createSchema({
    passphrase: Joi.string()
  })
}

export const getKeyRequest = {
  query: createSchema({
    includePrivate: Joi.string()
  })
}

export const createNewAddressRequest = {
  body: createSchema({
    name: Joi.string()
  })
}

export const getAddressRequest = {}

export const getBalanceRequest = {}

export const listAddressesRequest = {
  query: createSchema({
    nextPageToken: Joi.string(),
    limit: Joi.string().required()
  })
}

export const sendTransactionRequest = {
  body: createSchema({
    xprv: Joi.string().required(),
    recipients: Joi.array().required()
  })
}

export const signEthWalletWithdrawalRequest = {
  body: createSchema({
    pk: Joi.string().required(),
    address: Joi.string().required(),
    amount: Joi.string().required(),
    data: Joi.string().empty(''),
    expireBlock: Joi.number().required(),
    contractNonce: Joi.number().required()
  })
}

export const signTokenWalletWithdrawalRequest = {
  body: createSchema({
    pk: Joi.string().required(),
    address: Joi.string().required(),
    amount: Joi.string().required(),
    contractAddress: Joi.string().required(),
    expireBlock: Joi.number().required(),
    contractNonce: Joi.number().required()
  })
}

export const sendEthRequest = {
  body: createSchema({
    address: Joi.string().required(),
    value: Joi.string().required(),
    data: Joi.string().empty(''),
    prvKey: Joi.string()
  })
}

export const sendTokensRequest = {
  body: createSchema({
    address: Joi.string().required(),
    contractAddress: Joi.string().required(),
    value: Joi.string().required(),
    prvKey: Joi.string()
  })
}
