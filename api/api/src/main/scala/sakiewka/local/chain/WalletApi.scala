package sakiewka.local.chain

import java.time.Instant

import com.softwaremill.tagging.@@
import sakiewka.local.Json._
import io.circe.generic.auto._
import sakiewka.local.Common._
import sakiewka.local.Success_OUT
import sakiewka.local.TapirSupport._
import sttp.tapir.json.circe._
import sakiewka.local.chain.KeyApi.Response.StoredKeyType
import sttp.tapir.{jsonBody, _}

class WalletApi(val currency: String) {

  import WalletApi.Request._
  import WalletApi.Response._

  implicit val schemaForStoredKeyType: Schema[StoredKeyType] = Schema(SchemaType.SString)

  private val walletEndpoint = secureEndpoint.in(currency / "wallet")
  private val walletIdPathInput: EndpointInput[Id @@ Wallet] = currency / "wallet" / path[Id @@ Wallet]("walletId")

  private val createWallet = walletEndpoint.post
    .in(jsonBody[CreateWalletRequest])
    .out(jsonBody[Success_OUT[CreateWalletResponse]])

  private val getWallets = walletEndpoint.get
    .in(pagingInput)
    .in(query[Option[String]]("searchPhrase"))
    .out(jsonBody[Success_OUT[ListWalletsResponse]])

  private val editWallet = walletEndpoint.patch
    .in(jsonBody[EditWalletRequest])

  private val getWallet = secureEndpoint.get
    .in(walletIdPathInput)
    .out(jsonBody[Success_OUT[GetWalletResponse]])

  private val maxTransfer = secureEndpoint.get
    .in(walletIdPathInput)
    .in(query[String]("recipient") and query[SatoshisPerByte]("feeRate"))
    .out(jsonBody[Success_OUT[MaxTransferResponse]])

  val endpoints: List[Endpoint[_, _, _, _]] = List(createWallet, getWallet, getWallets, maxTransfer)
}

object WalletApi {

  object Request {

    case class CreateWalletRequest(name: String,
                                   passphrase: Option[String],
                                   userPubKey: Option[String],
                                   backupPubKey: Option[String])

    case class EditWalletRequest(name: String)
  }

  object Response {

    case class CreateWalletResponse(id: String,
                                    initialAddress: String,
                                    servicePubKey: String,
                                    keys: List[StoredKeyType])

    case class ListWalletsResponse(data: List[Wallet], nextPageToken: String)

    case class Wallet(id: Id @@ Wallet, name: String, currency: String, created: Instant, balance: WalletBalance)

    case class WalletBalance(available: String, locked: String)

    case class GetWalletResponse(id: Id @@ Wallet,
                                 name: String,
                                 currency: String,
                                 created: Instant,
                                 keys: List[StoredKeyType],
                                 canSendFundsUsingPassword: Boolean,
                                 balance: WalletBalance)

    case class MaxTransferResponse(amount: String)
  }
}
