# Getting Started

This page takes you from a Java development environment to a verified Deep Netts installation, then points you to the right learning material. Follow the first four sections in order.

## 1. Prerequisites

You do not need previous Machine Learning experience. To follow the course, install:

- [JDK 25](https://www.oracle.com/java/technologies/downloads/);
- [Apache Maven](https://maven.apache.org/download.cgi);
- a Java IDE of your choice (optional).

Deep Netts 4 uses the Java Vector API, which will be enabled during Installation. Before continuing, verify that Java 25 and Maven are available:

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
com.deepnetts:deepnetts-core-pro:4.0.0
com.deepnetts:deepnetts-license:1.0
```

Download Deep Netts through the [official Deep Netts download page](https://www.deepnetts.com/checkout/). Use the distribution and license provided for your Deep Netts account or organization.

[Deep Netts Community Edition](https://www.deepnetts.com/deep-netts-community-edition/) is available separately from Maven Central, but it uses the `deepnetts-core` artifact. The course projects use `deepnetts-core-pro`; do not substitute one artifact for the other and assume the code will work unchanged.

Before continuing, make sure you have:

- the distribution that provides `deepnetts-core-pro:4.0.0`;
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
com/deepnetts/deepnetts-core-pro/4.0.0/
com/deepnetts/deepnetts-license/1.0/
```

### 3.3. Add the Maven dependencies

```xml
<dependencies>
    <dependency>
        <groupId>com.deepnetts</groupId>
        <artifactId>deepnetts-core-pro</artifactId>
        <version>4.0.0</version>
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

Use the minimal Hello World project to verify the complete runtime setup. It loads Deep Netts 4 Pro and its license, creates a neural network, and runs a prediction with Java 25 and the Vector API enabled.

<div class="resource-actions">
  <a class="explanation-button" href="hello-world/">View detailed explanation</a>
  <a class="github-example-button" href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/hello-world"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.64 0 8.13c0 3.59 2.29 6.64 5.47 7.71.4.08.55-.18.55-.39 0-.19-.01-.83-.01-1.51-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.21-3.64-.9-3.64-4.01 0-.89.31-1.62.82-2.19-.08-.21-.36-1.04.08-2.16 0 0 .67-.22 2.2.84A7.5 7.5 0 0 1 8 3.92a7.5 7.5 0 0 1 2 .27c1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.95.08 2.16.51.57.82 1.3.82 2.19 0 3.12-1.87 3.8-3.65 4.01.29.25.54.74.54 1.5 0 1.08-.01 1.95-.01 2.22 0 .21.15.47.55.39A8.16 8.16 0 0 0 16 8.13C16 3.64 12.42 0 8 0Z"></path></svg><span>View Hello World on GitHub</span></a>
</div>

## 5. Learning resources

Are you a Java developer looking for a concise introduction to Machine Learning with Deep Netts? Start with [Machine Learning Basics](../lectures/01-ml-basics.md) to learn how samples, features, targets, regression, and classification connect to Java code.

Want to understand Deep Netts 4 and its main capabilities? Read the [Deep Netts API lesson](../lectures/03-deep-netts-api.md) for an overview of datasets, preprocessing, model creation, training, evaluation, saving, and prediction.

Are you looking for focused guides covering in-depth usage of individual parts of the Deep Netts API? Open the [Deep Netts developer guides](../developer-guide/index.md) and choose the task you want to add to your workflow.

Are you looking for complete tutorials showing Deep Netts in action across different Machine Learning problems? Browse the [Deep Netts examples](../examples/index.md) for explained regression and classification walkthroughs linked to runnable Java 25 Maven projects.
