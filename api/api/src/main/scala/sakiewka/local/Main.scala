package sakiewka.local

import sakiewka.local.chain.ChainApi
import sakiewka.local.core.{TransferApi, UserApi}
import sttp.tapir.docs.openapi._
import sttp.tapir.openapi.circe.yaml._
import java.nio.file.{Paths, Files}
import java.nio.charset.StandardCharsets

object Main extends App {

  require(args.length == 1, "Required path, where to generate yaml file")

  val endpoints = UserApi.endpoints ++
    new TransferApi().endpoints ++
    new ChainApi("btc").endpoints ++
    new ChainApi("btg").endpoints

  val yaml = endpoints.toOpenAPI("sakiewka-crypto-local", "1.0").toYaml
  Files.write(Paths.get(args(0)), yaml.getBytes(StandardCharsets.UTF_8))
}
