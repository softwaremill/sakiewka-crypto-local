import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'

import logger from './logger'
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
import listWallets from './handlers/chain/bitcoin/list-wallet'
import getWallet from './handlers/chain/bitcoin/get-wallet'
import createAddress from './handlers/chain/bitcoin/create-address'
import getAddress from './handlers/chain/bitcoin/get-address'
import listAddresses from './handlers/chain/bitcoin/list-address'
import createKey from './handlers/chain/bitcoin/create-key'
import getKey from './handlers/chain/bitcoin/get-key'
import send from './handlers/chain/bitcoin/send'
import { ApiError, backendFactory, constants, Currency, sakiewkaApi, sakiewkaModule } from 'sakiewka-crypto'
import { errorResponse } from './response'
import { init2fa } from './handlers/core/user/init2fa'
import { confirm2fa } from './handlers/core/user/confirm2fa'
import { disable2fa } from './handlers/core/user/disable2fa'
import { balance } from './handlers/core/user/balance'
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

const swaggerDocument = YAML.load(`${__dirname}/swagger.yml`)
dotenv.config()

const app = express()
app.use(bodyParser.json())

const uuidv4 = require('uuid/v4')

// catches middleware errors
app.use((err: Error, req: Request, res: Response, next: Function) => {
  if (err) {
    const errorId = uuidv4()
    logger.error('Middleware error', { err, url: req.url, body: req.body, headers: req.headers })
    errorResponse(res, constants.API_ERROR.BAD_REQUEST, 'Middleware error', errorId)
  }
  next()
})

// catches server errors
const errorHandled = (fn: Function) => {
  return (req: Request, res: Response, next: Function) => {
    fn(req, res)
      .catch((err: any) => {
        const errorId = uuidv4()
        logger.error('Error during request processing', {
          errorId,
          stack: (err.stack || err.stacktrace),
          error: err,
          url: req.url,
          body: req.body,
          headers: req.headers
        })
        if (isApiError(err)) {
          errorResponse(res, err)
        } else {
          // @ts-ignore
          errorResponse(res, constants.API_ERROR.SERVER_ERROR, `${err.message} ${err.stack}`, errorId)
        }
      })
  }
}

function isApiError(error: any): error is ApiError {
  return error.code !== undefined && error.errors !== undefined
}

const backendApi = backendFactory(process.env.BACKEND_API_URL)
const sakiewkaApiModule = sakiewkaApi(backendApi, process.env.BTC_NETWORK)
// @ts-ignore
app.sakiewkaApi = sakiewkaApiModule
// @ts-ignore
app.backendApi = backendApi

// ENDPOINTS
// docs
app.use(`/${constants.BASE_API_PATH}/docs`, swaggerUI.serve, swaggerUI.setup(swaggerDocument))

// site
app.get('/', errorHandled(clientApp))

// user
app.post(`/${constants.BASE_API_PATH}/user/login`, errorHandled(login(sakiewkaApiModule)))
app.post(`/${constants.BASE_API_PATH}/user/logout`, errorHandled(logout(sakiewkaApiModule)))
app.post(`/${constants.BASE_API_PATH}/user/register`, errorHandled(register(sakiewkaApiModule)))
app.get(`/${constants.BASE_API_PATH}/user/info`, errorHandled(info(sakiewkaApiModule)))
app.post(`/${constants.BASE_API_PATH}/user/2fa/init`, errorHandled(init2fa(sakiewkaApiModule)))
app.post(`/${constants.BASE_API_PATH}/user/2fa/confirm`, errorHandled(confirm2fa(sakiewkaApiModule)))
app.post(`/${constants.BASE_API_PATH}/user/2fa/disable`, errorHandled(disable2fa(sakiewkaApiModule)))
app.post(`/${constants.BASE_API_PATH}/user/setup-password`, errorHandled(setupPassword(sakiewkaApiModule)))
app.get(`/${constants.BASE_API_PATH}/user/balance`, errorHandled(balance(sakiewkaApiModule)))

const currencies = [Currency.BTC, Currency.BTG]
currencies.forEach((currency) => {
  const sakiewkaCryptoModule = sakiewkaModule(currency, process.env.BTC_NETWORK)
  // @ts-ignore
  app[currency] = { cryptoModule: sakiewkaCryptoModule }

  // wallet
  const BASE_PATH = `${constants.BASE_API_PATH}/${currency}`
  app.post(`/${BASE_PATH}/wallet`, errorHandled(createWallet(sakiewkaApiModule, currency)))
  app.get(`/${BASE_PATH}/wallet`, errorHandled(listWallets(sakiewkaApiModule, currency)))
  app.get(`/${BASE_PATH}/wallet/:id`, errorHandled(getWallet(sakiewkaApiModule, currency)))
  app.post(`/${BASE_PATH}/wallet/:walletId/address`, errorHandled(createAddress(sakiewkaApiModule, currency)))
  app.get(`/${BASE_PATH}/wallet/:walletId/address/:address`, errorHandled(getAddress(sakiewkaApiModule, currency)))
  app.get(`/${BASE_PATH}/wallet/:walletId/address/`, errorHandled(listAddresses(sakiewkaApiModule, currency)))
  app.post(`/${BASE_PATH}/wallet/:walletId/send`, errorHandled(send(sakiewkaApiModule, currency)))
  app.get(`/${BASE_PATH}/wallet/:walletId/max-transfer-amount`, errorHandled(maxTransferAmount(sakiewkaApiModule, currency)))
  app.get(`/${BASE_PATH}/wallet/:walletId/policy`, errorHandled(listPoliciesForWallet(sakiewkaApiModule, currency)))
  app.get(`/${BASE_PATH}/wallet/:walletId/:address/utxo`, errorHandled(listUtxosByAddress(sakiewkaApiModule, currency)))

  // policies
  app.post(`/${BASE_PATH}/policy`, errorHandled(createNewPolicy(sakiewkaApiModule, currency)))
  app.post(`/${BASE_PATH}/policy/:policyId/assign`, errorHandled(assignPolicy(sakiewkaApiModule, currency)))
  app.get(`/${BASE_PATH}/policy`, errorHandled(listPolicies(sakiewkaApiModule, currency)))
  app.get(`/${BASE_PATH}/policy/:policyId/wallet`, errorHandled(listWalletsForPolicy(sakiewkaApiModule, currency)))

  // webhooks
  app.post(`/${BASE_PATH}/wallet/:walletId/webhooks`, errorHandled(createWebhook(sakiewkaApiModule, currency)))
  app.get(`/${BASE_PATH}/wallet/:walletId/webhooks`, errorHandled(listWebhooks(sakiewkaApiModule, currency)))
  app.get(`/${BASE_PATH}/wallet/:walletId/webhooks/:webhookId`, errorHandled(getWebhook(sakiewkaApiModule, currency)))
  app.delete(`/${BASE_PATH}/wallet/:walletId/webhooks/:webhookId`, errorHandled(deleteWebhook(sakiewkaApiModule, currency)))

  // key
  app.get(`/${BASE_PATH}/key/:id`, errorHandled(getKey(sakiewkaApiModule, currency)))
  // key local
  app.post(`/${BASE_PATH}/key/local`, errorHandled(createKey(sakiewkaCryptoModule)))
  app.post(`/${BASE_PATH}/key/local/encrypt`, errorHandled(encryptKey(sakiewkaCryptoModule)))
  app.post(`/${BASE_PATH}/key/local/decrypt`, errorHandled(decryptKey(sakiewkaCryptoModule)))

  // transfers
  app.get(`/${BASE_PATH}/wallet/:walletId/transfer/:txHash`, errorHandled(findTransferByTxHash(sakiewkaApiModule, currency)))
  app.get(`/${BASE_PATH}/wallet/:walletId/transfer`, errorHandled(listWalletTransfers(sakiewkaApiModule, currency)))

  // fee
  app.get(`/${BASE_PATH}/fee-rate`, errorHandled(getFeeRate(sakiewkaApiModule, currency)))
})

// transfers
app.get(`/${constants.BASE_API_PATH}/transfer/monthly-summary/:month/:year/:fiatCurrency`, errorHandled(monthlySummary(sakiewkaApiModule)))
app.get(`/${constants.BASE_API_PATH}/transfer`, errorHandled(listTransfers(sakiewkaApiModule)))

app.get(`/${constants.BASE_API_PATH}/chain-network-type`, errorHandled(chainNetworkType(backendApi)))

app.all('*', errorHandled(notFound))

export default app
