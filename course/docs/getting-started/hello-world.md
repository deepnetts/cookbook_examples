# Hello World

Use this small project to verify the Java and Deep Netts runtime before starting a Machine Learning example. It creates a neural network and runs a real prediction; it does not merely print a greeting.

## What this verifies

A successful run confirms that:

- Maven uses Java 25;
- Maven can resolve Deep Netts 4 Pro and its license from the local Maven repository;
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

The output should report Java 25. If it reports another version, select the correct JDK before continuing.

## 3. Compile

```bash
mvn compile
```

This confirms that Maven can resolve the installed Deep Netts 4 Pro and license artifacts and compile the Java source.

## 4. Run

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

## Expected result

The program prints a numerical prediction followed by:

```text
Java version: 25...
Vector API enabled: true
Deep Netts prediction for 1.0: ...
SUCCESS: Deep Netts is installed and configured correctly.
```

The exact Java patch version and prediction are not important. `Vector API enabled: true` confirms the runtime module, while reaching the success message means that the library was loaded, a Deep Netts network was created, and inference completed.

## If it fails

- If Maven cannot resolve the Deep Netts Pro or license artifact, repeat the local Maven import from Installation and reload the Maven project.
- If Java reports that `jdk.incubator.vector` is unavailable, confirm that Maven uses Java 25.
- If the Vector API module is not enabled, check that `MAVEN_OPTS` is set in the same terminal used to run Maven.

After this project succeeds, choose a complete regression or classification workflow.

<a class="back-button" href="../">← Back to Getting Started</a>
