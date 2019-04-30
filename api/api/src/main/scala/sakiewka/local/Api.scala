package sakiewka.local

import sakiewka.local.chain.ChainApi
import sakiewka.local.core.{TransferApi, UserApi}
import tapir.docs.openapi._
import tapir.openapi.circe.yaml._

object Api extends App {

  val endpoints = UserApi.endpoints ++
    new TransferApi().endpoints ++
    new ChainApi("btc").endpoints ++
    new ChainApi("btg").endpoints

  println(endpoints.toOpenAPI("sakiewka-crypto-local", "1.0").toYaml)
}
