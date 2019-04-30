package sakiewka.local.chain

//noinspection TypeAnnotation
class ChainApi(val currency: String) {

  val endpoints = new WalletApi(currency).endpoints ++
    new AddressApi(currency).endpoints ++
    new KeyApi(currency).endpoints ++
    new OutgointTransferApi(currency).endpoints ++
    new WebhookApi(currency).endpoints ++
    new ChainTransferApi(currency).endpoints
}
