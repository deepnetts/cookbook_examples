# Hello World

Use this small project to verify the complete Deep Netts setup before starting a Machine Learning example. It creates a neural network and runs a prediction; it does not merely print a greeting.

## What this verifies

A successful run confirms that:

- Maven uses Java 22;
- Maven can resolve the Deep Netts library and license artifacts;
- Deep Netts can create a neural network;
- the Java Vector API is enabled at runtime;
- Deep Netts can execute a prediction on CPU.

## 1. Get the project

Clone the repository that contains the runnable starter projects:

```bash
git clone https://github.com/deepnetts/cookbook-examples.git
cd cookbook-examples/examples/hello-world
```

The course website remains available online. Cloning is required here only because you are about to run a local Java project.

## 2. Confirm the active JDK

```bash
mvn --version
```

The output should report Java 22. If it reports another version, select the correct JDK before continuing.

## 3. Compile

```bash
mvn compile
```

This confirms that Maven can resolve the required Deep Netts artifacts and compile the Java source.

## 4. Run

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

## Expected result

The program prints a numerical prediction followed by:

```text
Java version: 22...
Vector API enabled: true
Deep Netts prediction for 1.0: ...
SUCCESS: Deep Netts is installed and configured correctly.
```

The exact Java patch version and prediction are not important. `Vector API enabled: true` confirms the runtime module, while reaching the success message means that the library was loaded, a Deep Netts network was created, and inference completed.

## If it fails

- If Maven cannot resolve `deepnetts-core-pro` or `deepnetts-license`, repeat the local Maven import step from Installation and verify the dependency versions.
- If Java reports that `jdk.incubator.vector` is unavailable, confirm that Maven uses Java 22.
- If the Vector API module is not enabled, check that `MAVEN_OPTS` is set in the same terminal used to run Maven.
- If Deep Netts reports a license error, verify that the license artifact supplied with your distribution was imported successfully.

## Continue

[Previous: Installation](installation.md) · [Next: Examples](../examples/index.md)

After this project succeeds, choose a complete regression or classification workflow.
