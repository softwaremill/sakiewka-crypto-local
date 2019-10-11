import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'

import logger, { winstonRequestsLogger } from './logger'
import dotenv from 'dotenv'
import clientApp from './handlers/client-app'
import notFound from './handlers/not-found'
import { login } from './handlers/core/user/login'
import { logout } from './handlers/core/user/logout'
import { info } from './handlers/core/user/info'
import { monthlySummary } from './handlers/core/transfers/monthly-summary'
import listTransfers from './handlers/core/transfers/list-transfers'
import { register } from './handlers/core/user/register'
import createWallet from './handlers/chain/bitcoin/create-wallet'
import eosCreateWallet from './handlers/chain/bitcoin/eos-create-wallet'
import listWallets from './handlers/chain/bitcoin/list-wallet'
import getWallet from './handlers/chain/bitcoin/get-wallet'
import createAddress from './handlers/chain/bitcoin/create-address'
import getAddress from './handlers/chain/bitcoin/get-address'
import listAddresses from './handlers/chain/bitcoin/list-address'
import createKey from './handlers/chain/bitcoin/create-key'
import getKey from './handlers/chain/bitcoin/get-key'
import send from './handlers/chain/bitcoin/send'
import eosSend from './handlers/chain/bitcoin/eos-send'
import {
  ApiError,
  backendFactory,
  constants,
  Currency,
  networks,
  sakiewkaApiFactory,
  sakiewkaModuleFactory
} from 'sakiewka-crypto'
import { errorResponse } from './response'
import { init2fa } from './handlers/core/user/init2fa'
import { confirm2fa } from './handlers/core/user/confirm2fa'
import { disable2fa } from './handlers/core/user/disable2fa'
import { balance } from './handlers/core/user/balance'
import { createAuthToken } from './handlers/core/user/create-auth-token'
import { deleteAuthToken } from './handlers/core/user/delete-auth-token'
import { addSupportSubmission } from './handlers/core/user/add-support-submission'
import maxTransferAmount from './handlers/chain/bitcoin/max-transfer-amount'
import setupPassword from './handlers/core/user/setup-password'
import chainNetworkType from './handlers/chain-network-type'
import createWebhook from './handlers/chain/bitcoin/create-webhook'
import deleteWebhook from './handlers/chain/bitcoin/delete-webhook'
import listWebhooks from './handlers/chain/bitcoin/list-webhooks'
import getWebhook from './handlers/chain/bitcoin/get-webhook'
import createNewPolicy from './handlers/chain/bitcoin/create-policy'
import assignPolicy from './handlers/chain/bitcoin/assign-policy'
import listPolicies from './handlers/chain/bitcoin/list-policies'
import listPoliciesForWallet from './handlers/chain/bitcoin/list-policies-for-wallet'
import listWalletsForPolicy from './handlers/chain/bitcoin/list-wallets-for-policy'
import encryptKey from './handlers/chain/bitcoin/encrypt-key.'
import decryptKey from './handlers/chain/bitcoin/decrypt-key.'
import listWalletTransfers from './handlers/chain/bitcoin/list-wallet-transfers'
import findTransferByTxHash from './handlers/chain/bitcoin/find-transfer-by-tx-hash'
import getFeeRate from './handlers/chain/bitcoin/get-fee-rate'
import listUtxosByAddress from './handlers/chain/bitcoin/list-utxos-by-address'
import editWallet from './handlers/chain/bitcoin/edit-wallet'
import eosGetReferentialAccountId from './handlers/chain/bitcoin/eos-get-referential-account-id'

const correlator = require('express-correlation-id')
const swaggerDocument = YAML.load(`${__dirname}/swagger.yml`)
dotenv.config()

const uuidv4 = require('uuid/v4')
const app = express()
app.use(bodyParser.json())
app.use(correlator())
app.use(winstonRequestsLogger)

// catches middleware errors
app.use((err: Error, req: Request, res: Response, next: Function) => {
  if (err) {
    const errorId = uuidv4()
    errorResponse(
      res,
      constants.API_ERROR.BAD_REQUEST('Middleware error'),
      errorId
    )
  }
  next()
})

// catches server errors
const errorHandled = (fn: Function) => {
  return (req: Request, res: Response, next: Function) => {
    fn(req, res).catch((err: any) => {
      const errorId = uuidv4()
      logger.error('Error during request processing', {
        errorId,
        stack: err.stack || err.stacktrace,
        error: err,
        url: req.url,
        body: req.body,
        headers: req.headers
      })
      if (isApiError(err)) {
        errorResponse(res, err)
      } else {
        // @ts-ignore
        errorResponse(
          res,
          constants.API_ERROR.SERVER_ERROR(`${err.message} ${err.stack}`),
          errorId
        )
      }
    })
  }
}

function isApiError(error: any): error is ApiError {
  return error.code !== undefined && error.errors !== undefined
}

if (!process.env.BACKEND_API_URL) {
  throw new Error('Environment variable BACKEND_API_URL need to be defined')
}

const backendApi = backendFactory(
  process.env.BACKEND_API_URL,
  correlator.getId
)

if (!process.env.BTC_NETWORK) {
  throw new Error('Environment variable BTC_NETWORK need to be defined')
}
if (!process.env.EOS_CHAIN_ID) {
  throw new Error('Environment variable EOS_CHAIN_ID need to be defined')
}

const sakiewkaApi = sakiewkaApiFactory(
  backendApi,
  networks(process.env.EOS_CHAIN_ID)[process.env.BTC_NETWORK]
)

// @ts-ignore
app.sakiewkaApi = sakiewkaApi
// @ts-ignore
app.backendApi = backendApi

// ENDPOINTS
// docs
app.use(
  `/${constants.BASE_API_PATH}/docs`,
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument)
)

// site
app.get('/', errorHandled(clientApp))

// user
app.post(
  `/${constants.BASE_API_PATH}/user/login`,
  errorHandled(login(sakiewkaApi.user))
)
app.post(`/${constants.BASE_API_PATH}/user/logout`, errorHandled(logout))
app.post(
  `/${constants.BASE_API_PATH}/user/register`,
  errorHandled(register(sakiewkaApi.user))
)
app.get(
  `/${constants.BASE_API_PATH}/user/info`,
  errorHandled(info(sakiewkaApi.user))
)
app.post(
  `/${constants.BASE_API_PATH}/user/2fa/init`,
  errorHandled(init2fa(sakiewkaApi.user))
)
app.post(
  `/${constants.BASE_API_PATH}/user/2fa/confirm`,
  errorHandled(confirm2fa(sakiewkaApi.user))
)
app.post(
  `/${constants.BASE_API_PATH}/user/2fa/disable`,
  errorHandled(disable2fa(sakiewkaApi.user))
)
app.post(
  `/${constants.BASE_API_PATH}/user/setup-password`,
  errorHandled(setupPassword(sakiewkaApi.user))
)
app.get(
  `/${constants.BASE_API_PATH}/user/balance`,
  errorHandled(balance(sakiewkaApi.user))
)
app.post(
  `/${constants.BASE_API_PATH}/user/auth-token`,
  errorHandled(createAuthToken(sakiewkaApi.user))
)
app.post(
  `/${constants.BASE_API_PATH}/user/support`,
  errorHandled(addSupportSubmission(sakiewkaApi.user))
)
app.delete(
  `/${constants.BASE_API_PATH}/user/auth-token`,
  errorHandled(deleteAuthToken(sakiewkaApi.user))
)

const currencies = [Currency.BTC, Currency.BTG, Currency.EOS]
currencies.forEach(currency => {
  if (!process.env.BTC_NETWORK) {
    throw new Error('Environment variable BTC_NETWORK need to be defined')
  }

  const BASE_PATH = `${constants.BASE_API_PATH}/${currency}`
  const sakiewkaModule = sakiewkaModuleFactory(
    networks()[process.env.BTC_NETWORK]
  )[currency]

  // @ts-ignore
  app[currency] = { cryptoModule: sakiewkaModule }

  if (currency === Currency.BTC || currency === Currency.BTG) {
    app.post(
      `/${BASE_PATH}/wallet/:walletId/address`,
      errorHandled(createAddress(sakiewkaApi[currency].address))
    )
    app.get(
      `/${BASE_PATH}/wallet/:walletId/address/:address`,
      errorHandled(getAddress(sakiewkaApi[currency].address))
    )
    app.get(
      `/${BASE_PATH}/wallet/:walletId/address/`,
      errorHandled(listAddresses(sakiewkaApi[currency].address))
    )
    app.post(
      `/${BASE_PATH}/wallet/:walletId/send`,
      errorHandled(send(sakiewkaApi[currency].transaction))
    )
    // wallet
    app.get(
      `/${BASE_PATH}/wallet/:walletId/max-transfer-amount`,
      errorHandled(maxTransferAmount(sakiewkaApi[currency].wallet))
    )
    app.get(
      `/${BASE_PATH}/wallet/:walletId/:address/utxo`,
      errorHandled(listUtxosByAddress(sakiewkaApi[currency].wallet))
    )
    // policy
    app.post(
      `/${BASE_PATH}/policy`,
      errorHandled(createNewPolicy(sakiewkaApi[currency].policy))
    )
    app.post(
      `/${BASE_PATH}/policy/:policyId/assign`,
      errorHandled(assignPolicy(sakiewkaApi[currency].policy))
    )
    app.get(
      `/${BASE_PATH}/policy`,
      errorHandled(listPolicies(sakiewkaApi[currency].policy))
    )
    app.get(
      `/${BASE_PATH}/policy/:policyId/wallet`,
      errorHandled(listWalletsForPolicy(sakiewkaApi[currency].policy))
    )
    // webhooks
    app.post(
      `/${BASE_PATH}/wallet/:walletId/webhooks`,
      errorHandled(createWebhook(sakiewkaApi[currency].webhooks))
    )
    app.get(
      `/${BASE_PATH}/wallet/:walletId/webhooks`,
      errorHandled(listWebhooks(sakiewkaApi[currency].webhooks))
    )
    app.get(
      `/${BASE_PATH}/wallet/:walletId/webhooks/:webhookId`,
      errorHandled(getWebhook(sakiewkaApi[currency].webhooks))
    )
    app.delete(
      `/${BASE_PATH}/wallet/:walletId/webhooks/:webhookId`,
      errorHandled(deleteWebhook(sakiewkaApi[currency].webhooks))
    )
    // key
    app.get(
      `/${BASE_PATH}/key/:id`,
      errorHandled(getKey(sakiewkaApi[currency].key))
    )
    // transfers
    app.get(
      `/${BASE_PATH}/wallet/:walletId/transfer/:txHash`,
      errorHandled(findTransferByTxHash(sakiewkaApi[currency].transfers))
    )
    app.get(
      `/${BASE_PATH}/wallet/:walletId/transfer`,
      errorHandled(listWalletTransfers(sakiewkaApi[currency].transfers))
    )
    // fee
    app.get(
      `/${BASE_PATH}/fee-rate`,
      errorHandled(getFeeRate(sakiewkaApi[currency].feeRates))
    )
    app.post(
      `/${BASE_PATH}/wallet`,
      errorHandled(createWallet(sakiewkaApi[currency].wallet))
    )
  } else if (currency === Currency.EOS) {
    app.post(
      `/${BASE_PATH}/wallet`,
      errorHandled(eosCreateWallet(sakiewkaApi[currency].wallet))
    )
    app.post(
      `/${BASE_PATH}/wallet/:walletId/send`,
      errorHandled(eosSend(sakiewkaApi[currency].transaction))
    )
    app.get(
      `/${BASE_PATH}/user-reference-for-fee`,
      errorHandled(eosGetReferentialAccountId(sakiewkaApi[currency].accountFee))
    )
  }

  // wallet
  app.get(
    `/${BASE_PATH}/wallet/:walletId/policy`,
    errorHandled(listPoliciesForWallet(sakiewkaApi[currency].wallet))
  )
  app.patch(
    `/${BASE_PATH}/wallet/:id`,
    errorHandled(editWallet(sakiewkaApi[currency].wallet))
  )
  app.get(
    `/${BASE_PATH}/wallet`,
    errorHandled(listWallets(sakiewkaApi[currency].wallet))
  )
  app.get(
    `/${BASE_PATH}/wallet/:id`,
    errorHandled(getWallet(sakiewkaApi[currency].wallet))
  )

  // key local
  app.post(
    `/${BASE_PATH}/key/local`,
    errorHandled(createKey(sakiewkaModule.key))
  )
  app.post(
    `/${BASE_PATH}/key/local/encrypt`,
    errorHandled(encryptKey(sakiewkaModule.key))
  )
  app.post(
    `/${BASE_PATH}/key/local/decrypt`,
    errorHandled(decryptKey(sakiewkaModule.key))
  )
})

// transfers
app.get(
  `/${constants.BASE_API_PATH}/transfer/monthly-summary/:month/:year/:fiatCurrency`,
  errorHandled(monthlySummary(sakiewkaApi.transfers))
)
app.get(
  `/${constants.BASE_API_PATH}/transfer`,
  errorHandled(listTransfers(sakiewkaApi.transfers))
)

app.get(
  `/${constants.BASE_API_PATH}/chain-network-type`,
  errorHandled(chainNetworkType(backendApi))
)

app.all('*', errorHandled(notFound))

export default app
