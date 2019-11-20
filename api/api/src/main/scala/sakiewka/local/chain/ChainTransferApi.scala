package sakiewka.local.chain

import java.time.Instant

import com.softwaremill.tagging.@@
import io.circe.generic.auto._
import sakiewka.local.Common._
import sakiewka.local.Success_OUT
import sakiewka.local.Json._
import sakiewka.local.TapirSupport._
import sakiewka.local.chain.WalletApi.Response.Wallet
import sakiewka.local.core.TransferApi.Response.{BitcoinBlock, BitcoinTx, ListBtcTransfer}
import sttp.tapir._
import sttp.tapir.json.circe._

class ChainTransferApi(currency: String) {

  import ChainTransferApi.Response._

  private val walletIdPathInput: EndpointInput[Id @@ Wallet] = currency / "wallet" / path[Id @@ Wallet]("walletId")
  implicit val schemaForBitcoinTransferHistoryType: Schema[BitcoinTransferHistoryType] = Schema(SchemaType.SString)

  import ChainTransferApi.Response._

  private val txHashTransfersEndpoint = secureEndpoint
    .in(walletIdPathInput)
    .in("transfers" / path[String]("txHash"))
    .out(jsonBody[Success_OUT[List[BitcoinTransferWithHistoryResponse]]])

  private val transfersEndpoint = secureEndpoint
    .in(walletIdPathInput)
    .in("transfers")
    .in(pagingInput)
    .out(jsonBody[Success_OUT[ListBtcTransfer]])

  val endpoints: List[Endpoint[_, _, _, _]] = List(txHashTransfersEndpoint, transfersEndpoint)
}

object ChainTransferApi {

  object Response {

    case class BitcoinTransferWithHistoryResponse(wallet: Wallet,
                                                  timestamp: Instant,
                                                  transaction: BitcoinTx,
                                                  block: Option[BitcoinBlock],
                                                  history: List[BitcoinTransferHistoryItem])

    case class BitcoinTransferHistoryItem(timestamp: Instant,
                                          block: Option[BitcoinBlock],
                                          `type`: BitcoinTransferHistoryType)

    sealed trait BitcoinTransferHistoryType

    object BitcoinTransferHistoryType {

      case object Created extends BitcoinTransferHistoryType

      case object Mined extends BitcoinTransferHistoryType

      case object Removed extends BitcoinTransferHistoryType
    }
  }
}
