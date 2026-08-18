# Getting Started

This page takes you from a Java development environment to a verified Deep Netts installation. Follow the four sections in order.

## 1. Prerequisites

The course is written for Java developers who are new to Machine Learning. You do not need previous ML experience, but you should be comfortable reading Java classes, methods, arrays, and Maven project files.

### 1.1. Java 25

Download JDK 25 from the [official Oracle Java downloads page](https://www.oracle.com/java/technologies/downloads/).

All current Maven example projects compile with Java 25:

```xml
<maven.compiler.release>25</maven.compiler.release>
```

Confirm the active runtime:

```bash
java --version
javac --version
```

Both commands should report Java 25.

### 1.2. Apache Maven Build Tool

Maven is the recommended build tool for Deep Netts and is required by the runnable projects in this course. Download it from the [official Apache Maven page](https://maven.apache.org/download.cgi) and follow the [installation instructions](https://maven.apache.org/install.html).

Each example is a standalone Maven project with its own `pom.xml`. Confirm Maven is available:

```bash
mvn --version
```

The output includes the Java version and Java home used by Maven. If several JDKs are installed, confirm that Maven also reports Java 25.

### 1.3. Java Vector API

Deep Netts 4 uses the incubating Java Vector API. The module must be enabled when running an example:

```text
--add-modules jdk.incubator.vector
```

You will configure this option during Installation.

### 1.4. Java IDE (optional)

You can use any Java IDE. The example projects can also be opened in Apache NetBeans, which can store the Vector API VM option in its run configuration.

Before continuing, verify that these commands all succeed:

```bash
java --version
javac --version
mvn --version
```

## 2. Download

To run Deep Netts applications, download the distribution used by the examples. You can read this course online without cloning its source repository.

### 2.1. Choose the compatible distribution

The runnable projects currently require these Maven artifacts:

```text
com.deepnetts:deepnetts-core-pro:4.0.0-beta
com.deepnetts:deepnetts-license:1.0
```

Download Deep Netts through the [official Deep Netts download page](https://www.deepnetts.com/checkout/). Use the distribution and license provided for your Deep Netts account or organization.

[Deep Netts Community Edition](https://www.deepnetts.com/deep-netts-community-edition/) is available separately from Maven Central, but it uses the `deepnetts-core` artifact. The course projects use `deepnetts-core-pro`; do not substitute one artifact for the other and assume the code will work unchanged.

Before continuing, make sure you have:

- the distribution that provides `deepnetts-core-pro:4.0.0-beta`;
- the corresponding Deep Netts license;
- access to the import script included with the distribution.

Keep the distribution, license, credentials, and proprietary libraries outside source control.

## 3. Installation

These steps configure Deep Netts for Maven-based Java applications. Installing the optional Visual AI Builder is not required for the course examples.

### 3.1. Extract the distribution

Extract the downloaded package to a secure local directory. Keep the distribution and license files outside your application repositories.

### 3.2. Install the library in your local Maven repository

The distribution provides a script that imports the library and license artifacts into your local Maven repository.

On Windows:

```bat
ImportToLocalMaven.bat
```

On Linux or macOS:

```bash
chmod +x importToLocalMaven.sh
./importToLocalMaven.sh
```

Run the script from the extracted distribution directory. The artifacts are normally installed under:

```text
Windows: C:\Users\YOUR_USER\.m2\repository\com\deepnetts
Linux/macOS: ~/.m2/repository/com/deepnetts
```

Confirm that these versions exist:

```text
com/deepnetts/deepnetts-core-pro/4.0.0-beta/
com/deepnetts/deepnetts-license/1.0/
```

### 3.3. Add the Maven dependencies

```xml
<dependencies>
    <dependency>
        <groupId>com.deepnetts</groupId>
        <artifactId>deepnetts-core-pro</artifactId>
        <version>4.0.0-beta</version>
    </dependency>

    <dependency>
        <groupId>com.deepnetts</groupId>
        <artifactId>deepnetts-license</artifactId>
        <version>1.0</version>
    </dependency>
</dependencies>
```

Use the artifact versions supplied with your distribution. To run the examples unchanged, they must match the versions above.

### 3.4. Target Java 25

```xml
<properties>
    <maven.compiler.release>25</maven.compiler.release>
</properties>
```

Run `mvn --version` and confirm that Maven uses Java 25.

### 3.5. Enable the Vector API

On Linux or macOS:

```bash
MAVEN_OPTS="--add-modules jdk.incubator.vector" mvn exec:java
```

On Windows Command Prompt:

```bat
set MAVEN_OPTS=--add-modules jdk.incubator.vector
mvn exec:java
```

On Windows PowerShell:

```powershell
$env:MAVEN_OPTS="--add-modules jdk.incubator.vector"
mvn exec:java
```

In an IDE, add this VM option to the application's run configuration:

```text
--add-modules jdk.incubator.vector
```

### 3.6. Installation troubleshooting

If Maven cannot resolve an artifact, check that the import script succeeded, the required versions exist under `.m2/repository/com/deepnetts`, and `pom.xml` uses matching versions.

If the Vector API module is missing, confirm that Maven runs on Java 25 and the `--add-modules jdk.incubator.vector` option is applied to the process that starts the application.

## 4. Hello World

Use the minimal Hello World project to verify the complete setup. It creates a Deep Netts neural network and runs a prediction, confirming that Java 25, Maven, the library, license, and Vector API configuration work together.

[View Hello World on GitHub](https://github.com/deepnetts/cookbook-examples/tree/main/examples/hello-world)

[View detailed explanation](hello-world.md)

After Hello World succeeds, continue to [Examples](../examples/index.md) and choose a complete regression or classification workflow.
