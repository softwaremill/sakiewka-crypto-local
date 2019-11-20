package sakiewka.local.core

import java.time.Instant

import io.circe.generic.auto._
import sakiewka.local.Common.baseEndpoint
import sakiewka.local.{EmptyResponse, Success_OUT}
import sttp.tapir.{Endpoint, _}
import sttp.tapir.json.circe._

object UserApi {

  object Request {

    case class RegisterRequest(login: String)

    case class SetupPasswordRequest(password: String)

    case class LoginRequest(login: String, password: String, code: Option[Int])

    case class Init2faRequest(password: String)

    case class Confirm2faRequest(password: String, code: Int)

    case class Disable2faRequest(password: String, code: Int)

    case class CreateTokenRequest(duration: Option[String], ip: Option[String], scope: List[String])

    case class AddUserSupportSubmissionRequest(subject: String, content: String)

  }

  object Response {

    case class LoginResponse(token: String)

    case class TokenInfo(scope: List[String])

    case class UserInfoResponse(email: String,
                                token: String,
                                tokenInfo: TokenInfo,
                                expiry: Instant,
                                twoFaEnabled: Boolean)

    case class Init2FaResponse(qrCodeUrl: String, email: String, secretKey: String)

    case class SetupPasswordResponse(token: String)

    case class CreateTokenResponse(token: String)

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
    .out(jsonBody[Success_OUT[SetupPasswordResponse]])

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

  private val createAuthToken = userBaseEndpoint.post
    .in(auth.bearer)
    .in("auth-token")
    .in(jsonBody[CreateTokenRequest])
    .out(jsonBody[Success_OUT[CreateTokenResponse]])

  private val deleteAuthToken = userBaseEndpoint.delete
    .in(auth.bearer)
    .in("auth-token")
    .out(jsonBody[Success_OUT[EmptyResponse]])

  private val addUserSupportSubmission = userBaseEndpoint.post
    .in(auth.bearer)
    .in("support")
    .in(jsonBody[AddUserSupportSubmissionRequest])

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

    val endpoints: List[Endpoint[_, _, _, _]] = List(confirm2Fa, init2Fa, disable2Fa)
  }

  val endpoints: List[Endpoint[_, _, _, _]] =
    (List(register, setupPassword, login, info, logout, createAuthToken, deleteAuthToken, addUserSupportSubmission) ++ TwoFactor.endpoints)
      .map(_.tag("user"))
}
