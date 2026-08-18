# Deep Netts Hello World

This minimal Maven project verifies that Java, Maven, the Deep Netts library, the license artifact, and the Java Vector API runtime option are configured correctly.

The program creates a small `1 -> 1` neural network and performs one prediction. It does not train a useful model; the complete examples cover model development workflows.

## Requirements

- Java 25
- Maven
- `deepnetts-core-pro:4.0.0` installed or otherwise available to Maven
- `deepnetts-license:1.0` installed or otherwise available to Maven

## Run

From this directory, confirm that Maven uses Java 25:

```bash
mvn --version
mvn compile
```

Then enable the Vector API and run the program.

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
- If a Deep Netts artifact cannot be resolved, repeat the local Maven import and verify the dependency versions.
- If `jdk.incubator.vector` is unavailable, confirm that Maven uses Java 25 and that `MAVEN_OPTS` is set in the same terminal.

See the course [Getting Started](../../course/docs/getting-started/index.md) page for the complete Installation and Hello World flow.
