package sakiewka.local.chain

import sttp.tapir.Endpoint

class ChainApi(val currency: String) {

  val endpoints: List[Endpoint[_, _, _, _]] =
    (new WalletApi(currency).endpoints ++
      new AddressApi(currency).endpoints ++
      new KeyApi(currency).endpoints ++
      new OutgointTransferApi(currency).endpoints ++
      new WebhookApi(currency).endpoints ++
      new ChainTransferApi(currency).endpoints ++
      new FeeRateApi(currency).endpoints ++
      new UtxoApi(currency).endpoints).map(_.tag(currency))
}
