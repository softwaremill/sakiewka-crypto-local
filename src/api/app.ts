import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'

import dotenv from 'dotenv'
import clientApp from './handlers/client-app'
import notFound from './handlers/not-found'
import login from './handlers/login'
import logout from './handlers/logout'
import info from './handlers/info'
import register from './handlers/register'
import createWallet from './handlers/create-wallet'
import listWallets from './handlers/list-wallets'
import getWallet from './handlers/get-wallet'
import listTransfers from './handlers/list-transfers'
import getTransfer from './handlers/get-transfer'
import createKey from './handlers/create-key'
import { ethSign, tokenSign } from './handlers/eth-signatures'
import sakiewkaCrypto from 'sakiewka-crypto'
import { errorResponse } from './response'

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
        if (process.env.NODE_ENV === 'dev') {
          errorResponse(res, constants.API_ERROR.SERVER_ERROR, `${err.message} ${err.stack}`)
        } else {
          errorResponse(res, constants.API_ERROR.SERVER_ERROR)
        }
      })
  }
}

// ENDPOINTS

// site
app.get('/', errorHandled(clientApp))

// user
app.post(`/${constants.BASE_API_PATH}/user/login`, errorHandled(login))
app.post(`/${constants.BASE_API_PATH}/user/logout`, errorHandled(logout))
app.post(`/${constants.BASE_API_PATH}/user/register`, errorHandled(register))
app.get(`/${constants.BASE_API_PATH}/user/info`, errorHandled(info))

// wallet
app.post(`/${constants.BASE_API_PATH}/btc/wallet/create`, errorHandled(createWallet))
app.get(`/${constants.BASE_API_PATH}/btc/wallet`, errorHandled(listWallets))
app.get(`/${constants.BASE_API_PATH}/btc/wallet/:id`, errorHandled(getWallet))
app.get(`/${constants.BASE_API_PATH}/btc/wallet/:id/transfer`, errorHandled(listTransfers))
app.get(`/${constants.BASE_API_PATH}/btc/wallet/:walletId/transfer/:id`, errorHandled(getTransfer))

app.post(`/${constants.BASE_API_PATH}/eth/wallet/sign`, errorHandled(ethSign))
app.post(`/${constants.BASE_API_PATH}/eth/wallet/tokenSign`, errorHandled(tokenSign))

// key
app.post(`/${constants.BASE_API_PATH}/btc/key/create`, errorHandled(createKey))

app.get('*', errorHandled(notFound))

export default app
