import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'

import logger from './logger'
import dotenv from 'dotenv'
import clientApp from './handlers/client-app'
import notFound from './handlers/not-found'
import login from './handlers/user/login'
import logout from './handlers/user/logout'
import info from './handlers/user/info'
import register from './handlers/user/register'
import createWallet from './handlers/btc/create-wallet'
import listWallets from './handlers/btc/list-wallet'
import getWallet from './handlers/btc/get-wallet'
import getBalance from './handlers/btc/get-balance'
import listTransfers from './handlers/btc/list-transfer'
import getTransfer from './handlers/btc/get-transfer'
import listUtxo from './handlers/btc/list-utxo'
import createAddress from './handlers/btc/create-address'
import getAddress from './handlers/btc/get-address'
import listAddresses from './handlers/btc/list-address'
import createKey from './handlers/btc/create-key'
import getKey from './handlers/btc/get-key'
import send from './handlers/btc/send'
import sakiewkaCrypto from 'sakiewka-crypto'
import { errorResponse } from './response'
import init2fa from './handlers/user/init2fa'
import confirm2fa from './handlers/user/confirm2fa'
import disable2fa from './handlers/user/disable2fa'
import maxTransferAmount from './handlers/btc/max-transfer-amount';
import setupPassword from './handlers/user/setup-password';
import { ApiError } from 'sakiewka-crypto'

const swaggerDocument = YAML.load(`${__dirname}/swagger.yml`)
dotenv.config()

const app = express()
app.use(bodyParser.json())

const uuidv4 = require('uuid/v4')
const { constants } = sakiewkaCrypto

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
        logger.error('Error during request processing', { errorId, error: err, url: req.url, body: req.body, headers: req.headers })
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

// ENDPOINTS
// docs
app.use(`/${constants.BASE_API_PATH}/docs`, swaggerUI.serve, swaggerUI.setup(swaggerDocument))

// site
app.get('/', errorHandled(clientApp))

// user
app.post(`/${constants.BASE_API_PATH}/user/login`, errorHandled(login))
app.post(`/${constants.BASE_API_PATH}/user/logout`, errorHandled(logout))
app.post(`/${constants.BASE_API_PATH}/user/register`, errorHandled(register))
app.get(`/${constants.BASE_API_PATH}/user/info`, errorHandled(info))
app.post(`/${constants.BASE_API_PATH}/user/2fa/init`, errorHandled(init2fa))
app.post(`/${constants.BASE_API_PATH}/user/2fa/confirm`, errorHandled(confirm2fa))
app.post(`/${constants.BASE_API_PATH}/user/2fa/disable`, errorHandled(disable2fa))
app.post(`/${constants.BASE_API_PATH}/user/setup-password`, errorHandled(setupPassword))

// BTC
// wallet
app.post(`/${constants.BASE_API_PATH}/btc/wallet`, errorHandled(createWallet))
app.get(`/${constants.BASE_API_PATH}/btc/wallet`, errorHandled(listWallets))
app.get(`/${constants.BASE_API_PATH}/btc/wallet/:id`, errorHandled(getWallet))

app.get(`/${constants.BASE_API_PATH}/btc/wallet/:walletId/balance`, errorHandled(getBalance))

app.post(`/${constants.BASE_API_PATH}/btc/wallet/:walletId/utxo`, errorHandled(listUtxo))

app.get(`/${constants.BASE_API_PATH}/btc/wallet/:id/transfer`, errorHandled(listTransfers))
app.get(`/${constants.BASE_API_PATH}/btc/wallet/:walletId/transfer/:id`, errorHandled(getTransfer))

app.post(`/${constants.BASE_API_PATH}/btc/wallet/:walletId/address`, errorHandled(createAddress))
app.get(`/${constants.BASE_API_PATH}/btc/wallet/:walletId/address/:address`, errorHandled(getAddress))
app.get(`/${constants.BASE_API_PATH}/btc/wallet/:walletId/address/`, errorHandled(listAddresses))

app.post(`/${constants.BASE_API_PATH}/btc/wallet/:walletId/send`, errorHandled(send))

app.get(`/${constants.BASE_API_PATH}/btc/wallet/:walletId/max-transfer-amount`, errorHandled(maxTransferAmount))

// key
app.post(`/${constants.BASE_API_PATH}/btc/key`, errorHandled(createKey))
app.get(`/${constants.BASE_API_PATH}/btc/key/:id`, errorHandled(getKey))

app.all('*', errorHandled(notFound))

export default app
