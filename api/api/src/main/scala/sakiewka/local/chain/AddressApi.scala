package sakiewka.local.chain

import java.time.Instant

import com.softwaremill.tagging.@@
import io.circe.generic.auto._
import sakiewka.local.Common.{AddressValue, Id, secureEndpoint, _}
import sakiewka.local.Success_OUT
import sakiewka.local.TapirSupport._
import sakiewka.local.chain.WalletApi.Response.Wallet
import tapir.json.circe._
import tapir.{path, query, _}

class AddressApi(currency: String) {

  import AddressApi.Request._
  import AddressApi.Response._

  private val walletIdPathInput: EndpointInput[Id @@ Wallet] = currency / "wallet" / path[Id @@ Wallet]("walletId")

  private val createAddress = secureEndpoint.post
    .in(walletIdPathInput / "address")
    .in(query[Option[Boolean]]("change"))
    .in(jsonBody[CreateAddressRequest])
    .out(jsonBody[Success_OUT[CreateAddressResponse]])

  private val getAddress = secureEndpoint.get
    .in(walletIdPathInput / "address" / path[AddressValue]("address"))
    .out(jsonBody[Success_OUT[GetAddressResponse]])

  private val getAddresses = secureEndpoint.get
    .in(walletIdPathInput / "address")
    .in(pagingInput)
    .out(jsonBody[Success_OUT[ListAddressesResponse]])

  val endpoints: List[Endpoint[_, _, _, _]] = List(createAddress, getAddress, getAddresses)
}

object AddressApi {

  object Request {

    case class CreateAddressRequest(name: Option[String])

  }

  object Response {

    case class CreateAddressResponse(address: AddressValue, path: BIP45DerivationPath)

    case class BIP45DerivationPath(cosignerIndex: Int, change: Int, addressIndex: Int)

    case class GetAddressResponse(id: Id,
                                  address: AddressValue,
                                  path: BIP45DerivationPath,
                                  name: Option[String],
                                  created: Instant)

    case class ListAddressesResponse(addresses: List[GetAddressResponse], nextPageToken: Option[String])

  }

}
