package sakiewka.local.core

import java.time.Instant

import com.softwaremill.tagging.@@
import sakiewka.local.Common._
import tapir._
import io.circe.generic.auto._
import sakiewka.local.Json._
import sakiewka.local.Success_OUT
import sakiewka.local.TapirSupport._
import tapir.json.circe._

class TransferApi {

  import TransferApi.Response._
  private val listTransfers = secureEndpoint.get
    .in("transfers")
    .in(pagingInput)
    .out(jsonBody[Success_OUT[ListBtcTransfer]])

  private val monthlySummaryEndpoint = secureEndpoint.get
    .in("transfers" / "monthly-summary" / path[Int]("month") / path[Int]("year") / path[String]("fiatCurrency"))
    .out(jsonBody[Success_OUT[UserPeriodSummary]])

  val endpoints: List[Endpoint[_, _, _, _]] = List(monthlySummaryEndpoint, listTransfers)
}

object TransferApi {
  object Response {
    case class ListBtcTransfer(transfers: List[BitcoinTransfer], nextPageToken: Option[String])
    case class BitcoinTransfer(chain: String,
                               wallet: Wallet,
                               timestamp: Instant,
                               transaction: BitcoinTx,
                               block: Option[BitcoinBlock])
    case class Wallet(id: Id @@ Wallet, balance: String)
    case class BitcoinTx(hash: TxHash, inputs: ClassifiedRecipients, outputs: ClassifiedRecipients)
    case class ClassifiedRecipients(wallet: Map[AddressValue, String],
                                    service: Map[AddressValue, String],
                                    other: Map[AddressValue, String])
    case class BitcoinBlock(hash: BlockHash, number: BlockNumber, timestamp: Instant)

    case class UserPeriodSummary(chains: List[UserPeriodSummaryCurrencyEntry])

    case class UserPeriodSummaryCurrencyEntry(chain: String,
                                              totalOutputsOther: String,
                                              totalOutputsWallet: String,
                                              totalOutputsService: String,
                                              totalOutputsOtherInFiat: BigDecimal,
                                              totalOutputsWalletInFiat: BigDecimal,
                                              totalOutputsServiceInFiat: BigDecimal)
  }
}
