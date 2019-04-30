package sakiewka.local.chain

import java.time.Instant

import io.circe.generic.auto._
import sakiewka.local.Common.{Id, secureEndpoint, _}
import sakiewka.local.Success_OUT
import tapir.json.circe._
import tapir.{path, _}

class KeyApi(currency: String) {

  import KeyApi.Request._
  import KeyApi.Response._

  private val getKey = secureEndpoint.get
    .in(currency / "key" / path[String]("keyId"))
    .in(query[Option[Boolean]]("includePrivate"))
    .out(jsonBody[Success_OUT[GetKeyResponse]])

  private val createKey = baseEndpoint.post
    .in(currency / "key")
    .in(jsonBody[CreateKeyRequest])
    .out(jsonBody[Success_OUT[CreateKeyResponse]])

  val endpoints: List[Endpoint[_, _, _, _]] = List(getKey, createKey)
}

object KeyApi {

  object Request {

    case class CreateKeyRequest(passphrase: Option[String])

  }

  object Response {

    case class GetKeyResponse(id: Id,
                              pubKey: XPub,
                              prvKey: Option[EncryptedXPrv],
                              keyType: StoredKeyType,
                              created: Instant)

    case class CreateKeyResponse(keyPair: KeyPair)

    case class KeyPair(pubKey: XPub, prvKey: EncryptedXPrv) //TODO Either[Xprv, EncryptedXprv]

    case class StoredKeyType(id: String, `type`: KeyType)

    sealed trait KeyType

    case object User extends KeyType

    case object Service extends KeyType

    case object Backup extends KeyType

  }

}
