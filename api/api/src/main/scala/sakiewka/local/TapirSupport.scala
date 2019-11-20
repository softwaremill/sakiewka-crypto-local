package sakiewka.local

import com.softwaremill.tagging.{@@, Tagger}
import sttp.tapir.Codec.PlainCodec
import sttp.tapir.{Schema, SchemaType}

object TapirSupport {
  implicit def schemaForTagged[U, T](implicit uc: Schema[U]): Schema[U @@ T] = uc.asInstanceOf[Schema[U @@ T]]

  implicit def taggedPlainCodec[U, T](implicit uc: PlainCodec[U]): PlainCodec[U @@ T] =
    uc.map(_.taggedWith[T])(identity)

  implicit val schemaForBigDecimal: Schema[BigDecimal] = Schema(SchemaType.SString)
}
