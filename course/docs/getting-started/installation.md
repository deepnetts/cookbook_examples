# Installation

This page configures Deep Netts for Maven-based Java applications. It focuses on the library used by the course examples; installing the optional Visual AI Builder is not required to run them.

## 1. Extract the Deep Netts distribution

Extract the package downloaded in the previous step to a secure local directory. Keep the distribution and its license files outside your application source repositories.

## 2. Install the libraries in your local Maven repository

The Deep Netts distribution provides a script that imports the required library and license artifacts into your local Maven repository.

On Windows, run:

```bat
ImportToLocalMaven.bat
```

On Linux or macOS, run:

```bash
chmod +x importToLocalMaven.sh
./importToLocalMaven.sh
```

Run the script from the extracted distribution directory. A successful import places the Deep Netts artifacts under your local Maven repository, normally:

```text
Windows: C:\Users\YOUR_USER\.m2\repository\com\deepnetts
Linux/macOS: ~/.m2/repository/com/deepnetts
```

Confirm that the versions required by the course exist below that directory:

```text
com/deepnetts/deepnetts-core-pro/4.0.0-beta/
com/deepnetts/deepnetts-license/1.0/
```

Each version directory should contain its corresponding JAR and Maven metadata. If either directory is missing, do not continue to the Java project yet; check the script output and confirm that the downloaded distribution contains the required versions.

## 3. Add the Maven dependencies

The current course examples use Deep Netts 4 beta and the Deep Netts license artifact:

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

Use the artifact versions supplied with your distribution. To run the course examples unchanged, those versions must match the versions shown above.

## 4. Target Java 25

Configure Maven to compile with Java 25:

```xml
<properties>
    <maven.compiler.release>25</maven.compiler.release>
</properties>
```

Confirm that Maven is using the expected JDK:

```bash
mvn --version
```

The output should report Java 25.

## 5. Enable the Vector API at runtime

Deep Netts 4 uses the incubating Java Vector API. Enable it when running a Maven application from a terminal:

```bash
MAVEN_OPTS="--add-modules jdk.incubator.vector" mvn exec:java
```

On Windows Command Prompt, set the option before running Maven:

```bat
set MAVEN_OPTS=--add-modules jdk.incubator.vector
mvn exec:java
```

On Windows PowerShell, use:

```powershell
$env:MAVEN_OPTS="--add-modules jdk.incubator.vector"
mvn exec:java
```

In an IDE, add this VM option to the application's run configuration:

```text
--add-modules jdk.incubator.vector
```

## Troubleshooting

### Maven cannot resolve a Deep Netts artifact

Check that:

- the import script completed successfully;
- the requested version exists under `.m2/repository/com/deepnetts`;
- the dependency versions in `pom.xml` match the installed distribution;
- Maven is using the expected local repository and user account.

### The Vector API module is missing

Confirm that Maven runs on Java 25 and that the `--add-modules jdk.incubator.vector` option is applied to the Java process that starts the application.

The Hello World project verifies the JDK, Maven dependencies, Deep Netts license, and Vector API configuration together.
