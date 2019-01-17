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
    login: Joi.string().required(),
    code: Joi.number().optional()
  })
}

export const logoutRequest = {}

export const infoRequest = {}

export const init2faRequest = {
  body: createSchema({
    password: Joi.string().required()
  })
}

export const confirm2faRequest = {
  body: createSchema({
    password: Joi.string().required(),
    code: Joi.number().required()
  })
}

export const disable2faRequest = {
  body: createSchema({
    password: Joi.string().required(),
    code: Joi.number().required()
  })
}

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
  body: createSchema({
    feeRateSatoshi: Joi.number().required(),
    recipients: Joi.array().items(Joi.object({
      address: Joi.string().required(),
      amount: Joi.number().required()
    })).required()
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
    xprv: Joi.string().optional(),
    passphrase: Joi.string().optional(),
    recipients: Joi.array().items(Joi.object({
      address: Joi.string().required(),
      amount: Joi.number().required()
    })).required()
  })
}
