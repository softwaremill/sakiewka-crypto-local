package sakiewka.local.chain

import com.softwaremill.tagging.@@
import io.circe.generic.auto._
import sakiewka.local.Common._
import sakiewka.local.Success_OUT
import sakiewka.local.TapirSupport._
import sakiewka.local.chain.WalletApi.Response.Wallet
import tapir.json.circe._
import tapir.{EndpointInput, jsonBody, path, _}

class OutgointTransferApi(val currency: String) {

  import OutgointTransferApi.Request._

  private val walletIdPathInput: EndpointInput[Id @@ Wallet] = currency / "wallet" / path[Id @@ Wallet]("walletId")

  private val send = secureEndpoint.post
    .in(walletIdPathInput / "send")
    .in(jsonBody[SendRequest])
    .out(jsonBody[Success_OUT[TxHash]])

  val endpoints: List[Endpoint[_, _, _, _]] = List(send)
}

object OutgointTransferApi {

  object Request {

    case class SendRequest(xprv: Option[XPrv], recipients: Map[AddressValue, String], passphrase: Option[String])

  }

}
