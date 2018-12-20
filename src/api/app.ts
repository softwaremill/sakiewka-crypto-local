import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'

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
import sendCoins from './handlers/btc/send-coins'
import sakiewkaCrypto from 'sakiewka-crypto'
import { errorResponse } from './response'
import init2fa from './handlers/user/init2fa';
import confirm2fa from './handlers/user/confirm2fa';
import disable2fa from './handlers/user/disable2fa';

const swaggerDocument = YAML.load(`${__dirname}/swagger.yml`)
dotenv.config()

const app = express()
app.use(bodyParser.json())

const { constants } = sakiewkaCrypto

// catches middleware errors
app.use((err: Error, req: Request, res: Response, next: Function) => {
  if (err) {
    errorResponse(res, constants.API_ERROR.BAD_REQUEST)
  }
  next()
})

// catches server errors
const errorHandled = (fn: Function) => {
  return (req: Request, res: Response, next: Function) => {
    fn(req, res)
      .catch((err: Error) => {
        if (['dev', 'test'].includes(process.env.NODE_ENV)) {
          errorResponse(res, constants.API_ERROR.SERVER_ERROR, `${err.message} ${err.stack}`)
        } else {
          errorResponse(res, constants.API_ERROR.SERVER_ERROR)
        }
      })
  }
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

// BTC
// wallet
app.post(`/${constants.BASE_API_PATH}/btc/wallet`, errorHandled(createWallet))
app.get(`/${constants.BASE_API_PATH}/btc/wallet`, errorHandled(listWallets))
app.get(`/${constants.BASE_API_PATH}/btc/wallet/:id`, errorHandled(getWallet))

app.get(`/${constants.BASE_API_PATH}/btc/wallet/:walletId/balance`, errorHandled(getBalance))

app.get(`/${constants.BASE_API_PATH}/btc/wallet/:walletId/utxo`, errorHandled(listUtxo))

app.get(`/${constants.BASE_API_PATH}/btc/wallet/:id/transfer`, errorHandled(listTransfers))
app.get(`/${constants.BASE_API_PATH}/btc/wallet/:walletId/transfer/:id`, errorHandled(getTransfer))

app.post(`/${constants.BASE_API_PATH}/btc/wallet/:walletId/address`, errorHandled(createAddress))
app.get(`/${constants.BASE_API_PATH}/btc/wallet/:walletId/address/:address`, errorHandled(getAddress))
app.get(`/${constants.BASE_API_PATH}/btc/wallet/:walletId/address/`, errorHandled(listAddresses))

app.post(`/${constants.BASE_API_PATH}/btc/wallet/:walletId/send-coins`, errorHandled(sendCoins))

// key
app.post(`/${constants.BASE_API_PATH}/btc/key`, errorHandled(createKey))
app.get(`/${constants.BASE_API_PATH}/btc/key/:id`, errorHandled(getKey))

app.all('*', errorHandled(notFound))

export default app
