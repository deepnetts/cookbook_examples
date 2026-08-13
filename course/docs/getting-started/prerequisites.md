# Prerequisites

The Deep Netts course is written for Java developers who are new to Machine Learning. You do not need previous ML experience, but you should be comfortable reading Java classes, methods, arrays, and Maven project files.

## Required software

Install or configure the following tools before running the complete examples.

### Java 22

Both Maven projects compile with Java 22:

```xml
<maven.compiler.release>22</maven.compiler.release>
```

Confirm the active runtime:

```bash
java --version
javac --version
```

Both commands should report Java 22. If several JDKs are installed, make sure Maven uses the same one:

```bash
mvn --version
```

The output includes the Java version and Java home used by Maven.

### Maven

Each example is a standalone Maven project with its own `pom.xml`.

Confirm Maven is available:

```bash
mvn --version
```

### Java Vector API

Deep Netts 4 uses the incubating Java Vector API. The module must be enabled when running an example:

```text
--add-modules jdk.incubator.vector
```

The [Running the Examples](running-examples.md) page shows how to supply this option from a terminal.

## Deep Netts dependencies

The examples use:

```text
deepnetts-core-pro 4.0.0-beta
deepnetts-license  1.0
```

Maven must be able to resolve these artifacts using the repositories and credentials configured for your Deep Netts environment. A valid Deep Netts license must also be available as required by your installation.

If Maven reports that a Deep Netts artifact cannot be resolved, verify your Deep Netts repository configuration before changing the example source code.

## Optional tools

You can work with the repository using any Java IDE. The projects may also be opened in Apache NetBeans, which can store the Vector API VM option in its run configuration.

For the MkDocs course itself, you additionally need Python with `venv` and `pip` support. The repository README contains the local preview commands.

## Before continuing

You are ready to run an example when all three commands succeed:

```bash
java --version
javac --version
mvn --version
```
