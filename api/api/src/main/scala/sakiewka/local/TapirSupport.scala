package sakiewka.local

import com.softwaremill.tagging.{@@, Tagger}
import tapir.Codec.PlainCodec
import tapir.{Schema, SchemaFor}

object TapirSupport {
  implicit def schemaForTagged[U, T](implicit uc: SchemaFor[U]): SchemaFor[U @@ T] = uc.asInstanceOf[SchemaFor[U @@ T]]

  implicit def taggedPlainCodec[U, T](implicit uc: PlainCodec[U]): PlainCodec[U @@ T] =
    uc.map(_.taggedWith[T])(identity)

  implicit val schemaForBigDecimal: SchemaFor[BigDecimal] = SchemaFor(Schema.SString)
}
