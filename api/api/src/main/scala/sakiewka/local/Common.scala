package sakiewka.local

import tapir.{Endpoint, EndpointInput, auth, endpoint, query}

case class Success_OUT[T](data: T, status: String = "success")

case class EmptyResponse()

object Common {
  type Id = String
  type AddressValue = String
  type EncryptedXPrv = String
  type XPrv = String
  type XPub = String
  type TxHash = String
  type Recipients = Map[AddressValue, String]
  type BlockHash = String
  type BlockNumber = Long
  type SatoshisPerByte = Long

  val baseEndpoint: Endpoint[Unit, Unit, Unit, Nothing] = endpoint.in("api/v1.0")

  val secureEndpoint: Endpoint[String, Unit, Unit, Nothing] = baseEndpoint
    .in(auth.bearer)

  val pagingInput: EndpointInput[(Int, Option[String])] = query[Int]("limit") and query[Option[String]]("nextPageToken")
}
