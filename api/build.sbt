lazy val commonSettings = commonSmlBuildSettings ++ acyclicSettings ++ Seq(
  organization := "com.sakiewka",
  scalaVersion := "2.12.8",
  scalafmtOnCompile := true
)

val circeVersion = "0.11.1"
val tapirVersion = "0.12.3"

lazy val rootProject = (project in file("."))
  .settings(commonSettings: _*)
  .settings(publishArtifact := false, name := "root")
  .aggregate(api)
  
lazy val api: Project = (project in file("api"))
  .settings(commonSettings: _*)
  .settings(
    name := "api",
    libraryDependencies ++= Seq(
      "io.circe" %% "circe-core" % circeVersion,
      "io.circe" %% "circe-generic" % circeVersion, // TODO: https://github.com/circe/circe-magnolia
      "io.circe" %% "circe-parser" % circeVersion,
      "io.circe" %% "circe-java8" % circeVersion,
      "com.softwaremill.common" %% "tagging" % "2.2.1",
      "com.softwaremill.sttp.tapir" %% "tapir-json-circe" % tapirVersion,
      "com.softwaremill.sttp.tapir" %% "tapir-http4s-server" % tapirVersion,
      "com.softwaremill.sttp.tapir" %% "tapir-openapi-docs" % tapirVersion,
      "com.softwaremill.sttp.tapir" %% "tapir-openapi-circe-yaml" % tapirVersion,
    )
  )
