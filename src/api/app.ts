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
import listWallets from './handlers/btc/list-wallets'
import getWallet from './handlers/btc/get-wallet'
import listTransfers from './handlers/btc/list-transfers'
import getTransfer from './handlers/btc/get-transfer'
import createAddress from './handlers/btc/create-address'
import getAddress from './handlers/btc/get-address'
import createKey from './handlers/btc/create-key'
import getKey from './handlers/btc/get-key'
import { signEth, signTokens } from './handlers/eth/sign'
import { sendEth, sendTokens } from './handlers/eth/send'
import sakiewkaCrypto from 'sakiewka-crypto'
import { errorResponse } from './response'

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
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

// site
app.get('/', errorHandled(clientApp))

// user
app.post(`/${constants.BASE_API_PATH}/user/login`, errorHandled(login))
app.post(`/${constants.BASE_API_PATH}/user/logout`, errorHandled(logout))
app.post(`/${constants.BASE_API_PATH}/user/register`, errorHandled(register))
app.get(`/${constants.BASE_API_PATH}/user/info`, errorHandled(info))

// BTC
// wallet
app.post(`/${constants.BASE_API_PATH}/btc/wallet/create`, errorHandled(createWallet))
app.get(`/${constants.BASE_API_PATH}/btc/wallet`, errorHandled(listWallets))
app.get(`/${constants.BASE_API_PATH}/btc/wallet/:id`, errorHandled(getWallet))
app.get(`/${constants.BASE_API_PATH}/btc/wallet/:id/transfer`, errorHandled(listTransfers))
app.get(`/${constants.BASE_API_PATH}/btc/wallet/:walletId/transfer/:id`, errorHandled(getTransfer))
app.post(`/${constants.BASE_API_PATH}/btc/wallet/:walletId/address`, errorHandled(createAddress))
app.get(`/${constants.BASE_API_PATH}/btc/wallet/:walletId/address/:address`, errorHandled(getAddress))
// key
app.post(`/${constants.BASE_API_PATH}/btc/key/create`, errorHandled(createKey))
app.get(`/${constants.BASE_API_PATH}/btc/key/:id`, errorHandled(getKey))

// ETH
// walet
app.post(`/${constants.BASE_API_PATH}/eth/wallet/sign`, errorHandled(signEth))
app.post(`/${constants.BASE_API_PATH}/eth/wallet/tokenSign`, errorHandled(signTokens))
app.post(`/${constants.BASE_API_PATH}/eth/wallet/send-coins`, errorHandled(sendEth))
app.post(`/${constants.BASE_API_PATH}/eth/wallet/send-tokens`, errorHandled(sendTokens))

app.all('*', errorHandled(notFound))

export default app
