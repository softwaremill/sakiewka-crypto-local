package sakiewka.local.chain

import com.softwaremill.tagging.@@
import io.circe.generic.auto._
import sakiewka.local.Common.{Id, TxHash, secureEndpoint, _}
import sakiewka.local.Success_OUT
import sakiewka.local.TapirSupport._
import sakiewka.local.chain.AddressApi.Response.BIP45DerivationPath
import sakiewka.local.chain.WalletApi.Response.Wallet
import sttp.tapir.json.circe._
import sttp.tapir.{EndpointInput, path, _}

class UtxoApi(currency: String) {
  import UtxoApi.Response._

  private val walletIdPathInput: EndpointInput[Id @@ Wallet] = currency / "wallet" / path[Id @@ Wallet]("walletId")

  private val listUtxosByAddress = secureEndpoint.get
    .in(walletIdPathInput / path[String]("address") / "utxo")
    .in(pagingInput)
    .out(jsonBody[Success_OUT[ListUtxosByAddress]])

  val endpoints: List[Endpoint[_, _, _, _]] = List(listUtxosByAddress)
}

object UtxoApi {

  object Response {

    case class BitcoinUnspentOutputWithPath(txHash: TxHash, n: Int, amount: String, path: BIP45DerivationPath)

    case class ListUtxosByAddress(outputs: List[BitcoinUnspentOutputWithPath], nextPageToken: Option[String])
  }

}
