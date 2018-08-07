import Joi, { SchemaMap } from 'joi'

const createSchema = (object: SchemaMap) => Joi.object().keys(object)

export const registerRequest = createSchema({
  password: Joi.string().required(),
  login: Joi.string().required()
})

export const loginRequest = createSchema({
  password: Joi.string().required(),
  login: Joi.string().required()
})

export const logoutRequest = createSchema({})

export const infoRequest = createSchema({})

export const createWalletRequest = createSchema({
  name: Joi.string().required(),
  userPubKey: Joi.string(),
  backupPubKey: Joi.string(),
  passphrase: Joi.string().required()
})

export const getWalletRequest = createSchema({})

export const listWalletsRequest = createSchema({})

export const getTransferRequest = createSchema({})

export const listTransfersRequest = createSchema({})

export const createKeyRequest = createSchema({
  passphrase: Joi.string()
})
