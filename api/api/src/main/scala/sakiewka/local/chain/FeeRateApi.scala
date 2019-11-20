package sakiewka.local.chain

import io.circe.generic.auto._
import sakiewka.local.Common.{SatoshisPerByte, baseEndpoint}
import sakiewka.local.Success_OUT
import sttp.tapir.json.circe._
import sttp.tapir.{jsonBody, _}

class FeeRateApi(val currency: String) {

  import FeeRateApi.Response._

  private val getFeeRate = baseEndpoint.get
    .in(currency / "fee-rate")
    .out(jsonBody[Success_OUT[GetFeeRate_OUT]])

  val endpoints: List[Endpoint[_, _, _, _]] = List(getFeeRate)
}

object FeeRateApi {

  object Response {

    case class GetFeeRate_OUT(recommended: SatoshisPerByte)
  }
}
