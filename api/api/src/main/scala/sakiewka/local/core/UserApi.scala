package sakiewka.local.core

import java.time.Instant

import sakiewka.local.Common.baseEndpoint
import sakiewka.local.{EmptyResponse, Success_OUT}
import tapir.Endpoint
import tapir._
import tapir.json.circe._
import io.circe.generic.auto._

object UserApi {

  object Request {

    case class RegisterRequest(login: String)

    case class SetupPasswordRequest(password: String)

    case class LoginRequest(login: String, password: String, code: Option[String])

    case class Init2faRequest(password: String)

    case class Confirm2faRequest(password: String, code: Int)

    case class Disable2faRequest(password: String, code: Int)

  }

  object Response {

    case class LoginResponse(token: String)

    case class TokenInfo(scope: List[String])

    case class UserInfoResponse(email: String, token: String, tokenInfo: TokenInfo, expiry: Instant)

    case class Init2FaResponse(qrCodeUrl: String, email: String, secretKey: String)

  }

  import Request._
  import Response._

  private val userBaseEndpoint = baseEndpoint.in("user")

  private val register = userBaseEndpoint.post
    .in("register")
    .in(jsonBody[RegisterRequest])
    .out(jsonBody[Success_OUT[EmptyResponse]])

  private val setupPassword = userBaseEndpoint.post
    .in(auth.bearer)
    .in("setup-password")
    .in(jsonBody[SetupPasswordRequest])
    .out(jsonBody[Success_OUT[EmptyResponse]])

  private val login = userBaseEndpoint.post
    .in("login")
    .in(jsonBody[LoginRequest])
    .out(jsonBody[Success_OUT[LoginResponse]])

  private val info = userBaseEndpoint.get
    .in(auth.bearer)
    .in("info")
    .out(jsonBody[Success_OUT[UserInfoResponse]])

  private val logout = userBaseEndpoint.post
    .in(auth.bearer)
    .in("logout")
    .out(jsonBody[Success_OUT[EmptyResponse]])

  object TwoFactor {
    private val twoFactorEndpoint = userBaseEndpoint
      .in(auth.bearer)
      .in("2fa")

    private val init2Fa = twoFactorEndpoint.post
      .in("init")
      .in(jsonBody[Init2faRequest])
      .out(jsonBody[Success_OUT[Init2FaResponse]])

    private val confirm2Fa = twoFactorEndpoint.post
      .in("confirm")
      .in(jsonBody[Confirm2faRequest])
      .out(jsonBody[Success_OUT[EmptyResponse]])

    private val disable2Fa = twoFactorEndpoint.post
      .in("disable")
      .in(jsonBody[Disable2faRequest])
      .out(jsonBody[Success_OUT[EmptyResponse]])

    val endpoints: List[Endpoint[_, _, _, _]] = List(confirm2Fa, init2Fa, disable2Fa).map(_.tag("user"))
  }

  val endpoints: List[Endpoint[_, _, _, _]] = List(register, setupPassword, login, info, logout) ++ TwoFactor.endpoints
}
