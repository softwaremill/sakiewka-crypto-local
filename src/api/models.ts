import Joi, { SchemaMap } from 'joi'
import BigNumber from 'bignumber.js'

const createSchema = (object: SchemaMap) => Joi.object().keys(object)

const bigNumberJoi = Joi.extend(joi => ({
  base: joi.string(),
  name: 'bigNumber',
  pre(value, state, options) {
    return new BigNumber(value)
  }
}))

export const registerRequest = {
  body: createSchema({
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

export const monthlySummaryRequest = {}

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

export const eosCreateWalletRequest = {
  body: createSchema({
    name: Joi.string().required(),
    eosAccountName: Joi.string().required(),
    userPubKey: Joi.string(),
    backupPubKey: Joi.string(),
    passphrase: Joi.string().required()
  })
}

export const editWalletRequest = {
  body: createSchema({
    name: Joi.string().required()
  })
}

export const createWebhookRequest = {
  body: createSchema({
    callbackUrl: Joi.string().required(),
    settings: Joi.object()
  })
}

export const deleteWebhookRequest = {}
export const getWebhookRequest = {}
export const listWebhookRequest = {
  query: createSchema({
    nextPageToken: Joi.string(),
    limit: Joi.string().required()
  })
}

export const getWalletRequest = {}

export const listWalletsRequest = {
  query: createSchema({
    nextPageToken: Joi.string(),
    limit: Joi.string().required(),
    searchPhrase: Joi.string()
  })
}

export const getTransferRequest = {}

export const listUtxoRequest = {
  body: createSchema({
    feeRateSatoshi: Joi.string().required(),
    recipients: Joi.array()
      .items(
        Joi.object({
          address: Joi.string().required(),
          amount: bigNumberJoi.bigNumber().required()
        })
      )
      .required()
  })
}

export const createKeyRequest = {
  body: createSchema({
    passphrase: Joi.string()
  })
}

export const encryptKeyRequest = {
  body: createSchema({
    keyPair: Joi.object({
      pubKey: Joi.string(),
      prvKey: Joi.string()
    }),
    passphrase: Joi.string()
  })
}

export const decryptKeyRequest = {
  body: createSchema({
    keyPair: Joi.object({
      pubKey: Joi.string(),
      prvKey: Joi.string()
    }),
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

export const listAddressesRequest = {
  query: createSchema({
    nextPageToken: Joi.string(),
    limit: Joi.string().required()
  })
}

export const listUtxosByAddressRequest = {
  query: createSchema({
    nextPageToken: Joi.string(),
    limit: Joi.string().required()
  })
}

export const listTransfersRequest = {
  query: createSchema({
    nextPageToken: Joi.string(),
    limit: Joi.string().required()
  })
}

export const listWalletTransfersRequest = {
  query: createSchema({
    nextPageToken: Joi.string().optional(),
    limit: Joi.string().required()
  })
}

export const findTransferByTxHashRequest = {}

export const eosSendTransactionRequest = {
  body: createSchema({
    xprv: Joi.string().optional(),
    passphrase: Joi.string().optional(),
    from: Joi.string().required(),
    to: Joi.string().required(),
    quantity: Joi.object({
      amount: Joi.string().required(),
      currency: Joi.string().required()
    }),
    memo: Joi.string().optional()
  })
}

export const sendTransactionRequest = {
  body: createSchema({
    xprv: Joi.string().optional(),
    passphrase: Joi.string().optional(),
    recipients: Joi.array()
      .items(
        Joi.object({
          address: Joi.string().required(),
          amount: bigNumberJoi.bigNumber().required()
        })
      )
      .required(),
    feeRate: Joi.number().optional()
  })
}

export const maxTransferAmountRequest = {
  query: createSchema({
    feeRate: Joi.number().required(),
    recipient: Joi.string().required()
  })
}

export const setupPasswordRequest = {
  body: createSchema({
    password: Joi.string().required()
  })
}

export const addSupportSubmissionRequest = {
  body: createSchema({
    subject: Joi.string().required(),
    content: Joi.string().required()
  })
}

export const createNewPolicyRequest = {
  body: createSchema({
    name: Joi.string(),
    policySettings: Joi.object()
  })
}

export const assignPolicyRequest = {
  query: createSchema({
    policyId: Joi.string()
  }),
  body: createSchema({
    walletId: Joi.string()
  })
}

export const listPolicyRequest = {
  query: createSchema({
    nextPageToken: Joi.string(),
    limit: Joi.string().required()
  })
}

export const listPoliciesForWalletRequest = {
  query: createSchema({
    walletId: Joi.string()
  })
}

export const listWalletsForPolicyRequest = {
  query: createSchema({
    policyId: Joi.string()
  })
}

export const balanceRequest = {
  body: createSchema({
    fiatCurrency: Joi.string().required()
  })
}

export const createAuthTokenRequest = {
  body: createSchema({
    duration: Joi.string(),
    ip: Joi.string(),
    scope: Joi.array().items(Joi.string())
  })
}
