import { Currency } from 'sakiewka-crypto/dist'

export const randomString = () => Math.random().toString(36).substring(7)

type TestFunc = (Currency) => void | PromiseLike<void>

const forMultipleCurrencies = (currencies:Currency[]) => (testName, testFunc: TestFunc) => {
  currencies.forEach(currency => {
    const mochaFunc = () => testFunc(currency)
    describe(`${currency} > ${testName}`, mochaFunc)
  })
}

export const forBTCandBTG = forMultipleCurrencies([Currency.BTC, Currency.BTG])

export const forAllCurrencies = forMultipleCurrencies([Currency.BTC, Currency.BTG, Currency.EOS])
