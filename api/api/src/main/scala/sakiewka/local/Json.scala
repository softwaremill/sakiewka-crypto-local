package sakiewka.local

import com.softwaremill.tagging.@@
import io.circe.{Decoder, Encoder}
import sakiewka.local.Common.Id

object Json {
  // can't define a generic encoder because of https://stackoverflow.com/questions/48174799/decoding-case-class-w-tagged-type
  implicit def taggedIdEncoder[U]: Encoder[Id @@ U] = Encoder.encodeString.asInstanceOf[Encoder[Id @@ U]]

  // can't define a generic encoder because of https://stackoverflow.com/questions/48174799/decoding-case-class-w-tagged-type
  implicit def taggedIdDecoder[U]: Decoder[Id @@ U] = Decoder.decodeString.asInstanceOf[Decoder[Id @@ U]]
}
