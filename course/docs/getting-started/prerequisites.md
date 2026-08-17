# Prerequisites

The Deep Netts course is written for Java developers who are new to Machine Learning. You do not need previous ML experience, but you should be comfortable reading Java classes, methods, arrays, and Maven project files.

## Required software

Install or configure the following tools before running the complete examples.

### Java 22

All current Maven example projects compile with Java 22:

```xml
<maven.compiler.release>22</maven.compiler.release>
```

Confirm the active runtime:

```bash
java --version
javac --version
```

Both commands should report Java 22.

### Maven

Each example is a standalone Maven project with its own `pom.xml`.

Confirm Maven is available:

```bash
mvn --version
```

The output includes the Java version and Java home used by Maven. If several JDKs are installed, confirm that Maven also reports Java 22.

### Java Vector API

Deep Netts 4 uses the incubating Java Vector API. The module must be enabled when running an example:

```text
--add-modules jdk.incubator.vector
```

You do not need to configure this option yet. The Installation page shows how to apply it from a terminal or IDE.

## Optional tools

You can use any Java IDE. The example projects can also be opened in Apache NetBeans, which can store the Vector API VM option in its run configuration.

## Before continuing

Your Java toolchain is ready for the installation steps when all three commands succeed and report the expected Java version:

```bash
java --version
javac --version
mvn --version
```

## Continue

[Back to Getting Started](index.md) · [Next: Download](download.md)
