package sakiewka.local.chain

import com.softwaremill.tagging
import com.softwaremill.tagging.@@
import io.circe.generic.auto._
import sakiewka.local.Common._
import sakiewka.local.TapirSupport._
import sakiewka.local.chain.WalletApi.Response.Wallet
import sakiewka.local.{EmptyResponse, Success_OUT}
import tapir.json.circe._
import tapir.{path, _}

class WebhookApi(val currency: String) {

  import WebhookApi.Request._
  import WebhookApi.Response._

  private val walletIdPathInput: EndpointInput[Id @@ Wallet] = currency / "wallet" / path[Id @@ Wallet]("walletId")
  private val webhookIdPathInput
    : EndpointInput[(Id with tagging.Tag[Wallet], Id)] = walletIdPathInput / "webhook" / path[Id]("webhookId")

  private val createWebhook = secureEndpoint.post
    .in(walletIdPathInput / "webhook")
    .in(jsonBody[CreateWebhookRequest])
    .out(jsonBody[Success_OUT[EmptyResponse]])

  private val deleteWebhook = secureEndpoint.delete
    .in(webhookIdPathInput)
    .in(jsonBody[CreateWebhookRequest])
    .out(jsonBody[Success_OUT[EmptyResponse]])

  private val getWebhook = secureEndpoint.get
    .in(webhookIdPathInput)
    .out(jsonBody[GetWebhookResponse])

  private val getWebhookList = secureEndpoint.get
    .in(walletIdPathInput / "webhook")
    .in(pagingInput)
    .out(jsonBody[GetWebhookListResponse])

  val endpoints: List[Endpoint[_, _, _, _]] = List(createWebhook, deleteWebhook, getWebhook, getWebhookList)
}

object WebhookApi {

  object Request {

    case class CreateWebhookRequest(callbackUrl: String, `type`: WebhookType, webhookSettings: WebhookSettings)
  }

  object Response {

    case class GetWebhookResponse(id: String, walletId: String, callbackUrl: String, settings: WebhookSettings)

    case class GetWebhookListResponse(webhooks: List[GetWebhookResponse], nextPageToken: Option[String])
  }

  sealed trait WebhookType

  case object Transfer extends WebhookType

  sealed trait WebhookSettings {
    def `type`: WebhookType
  }

  case class TransferWebhookSettings(confirmations: Int) extends WebhookSettings {
    override def `type`: WebhookType = Transfer
  }
}
