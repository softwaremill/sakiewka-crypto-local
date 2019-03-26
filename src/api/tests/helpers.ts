import { Currency } from 'sakiewka-crypto'

export const randomString = () => Math.random().toString(36).substring(7)

const currencyUnderTest = process.env.CURRENCY_UNDER_TEST || ""
export const currency = Currency[currencyUnderTest]
if(currency == null) {
  throw new Error(`CURRENCY_UNDER_TEST env variable is set to '${currencyUnderTest}'. Must be set to one of the following values: ${Object.keys(Currency)}`)
}