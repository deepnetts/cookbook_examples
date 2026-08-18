# Deep Netts Hello World

This minimal Maven project verifies that Java, Maven, Deep Netts 4 Pro, its license, and the Java Vector API runtime option are configured correctly.

The program creates a small `1 -> 1` neural network and performs one prediction. It does not train a useful model; the complete examples cover model development workflows.

## Requirements

- Java 25
- Maven
- Deep Netts 4 Pro and its license imported into the local Maven repository

## Run

From this directory, confirm that Maven uses Java 25:

```bash
mvn --version
```

Then enable the Vector API and run the program.

On Linux or macOS:

```bash
MAVEN_OPTS="--add-modules jdk.incubator.vector" mvn clean compile exec:java
```

On Windows Command Prompt:

```bat
set MAVEN_OPTS=--add-modules jdk.incubator.vector
mvn clean compile exec:java
```

On Windows PowerShell:

```powershell
$env:MAVEN_OPTS="--add-modules jdk.incubator.vector"
mvn clean compile exec:java
```

A successful run ends with:

```text
Java version: 25...
Vector API enabled: true
Deep Netts prediction for 1.0: ...
SUCCESS: Deep Netts is installed and configured correctly.
```

The complete Java version and numerical prediction can differ between environments. `Vector API enabled: true` and the final success message confirm the required runtime setup.

## Troubleshooting

- If Maven reports that Java 25 is not available, select the correct JDK and run `mvn --version` again.
- If Maven cannot resolve the Deep Netts Pro or license artifact, repeat the local Maven import described in Getting Started.
- If `jdk.incubator.vector` is unavailable, confirm that Maven uses Java 25 and that `MAVEN_OPTS` is set in the same terminal.

See the course [Getting Started](../../course/docs/getting-started/index.md) page for the complete Installation and Hello World flow.
