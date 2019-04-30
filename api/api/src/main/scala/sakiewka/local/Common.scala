package sakiewka.local

import tapir.{auth, endpoint, query}

case class Success_OUT[T](data: T, status: String = "success")

case class EmptyResponse()

//noinspection TypeAnnotation
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
  val baseEndpoint = endpoint.in("api")

  val secureEndpoint = endpoint
    .in("api")
    .in(auth.bearer)

  val pagingInput = query[Int]("limit") and query[Option[String]]("nextPageToken")
}
