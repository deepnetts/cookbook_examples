# Running All Examples

Every project listed in [Examples](index.md) is a standalone Maven application and follows the same build-and-run process. Clone the repository only when you want to run or modify the code.

[View Examples on GitHub](https://github.com/deepnetts/cookbook-examples/tree/main/examples/)

Before continuing, complete [Hello World](../getting-started/index.md#4-hello-world) to verify Java 25, Maven, Deep Netts, licensing, and the Vector API.

## Get the example projects

Clone the repository:

```bash
git clone https://github.com/deepnetts/cookbook-examples.git
cd cookbook-examples
```

## Choose an example

Enter one of the project directories:

| Project | Directory | Result |
| --- | --- | --- |
| Simple Linear Regression | `examples/linear-regression` | Sorting execution time |
| Multiple Linear Regression | `examples/multiple-linear-regression` | Relative computer performance |
| Spam Classification | `examples/spam-classification` | Spam probability and class |
| Multiclass Classification | `examples/multiclass-classification` | Iris species probabilities and class |

For example:

```bash
cd examples/linear-regression
```

All following commands must be run from the selected project directory because datasets and generated models use project-relative paths.

## Compile and run

Compile the selected project:

```bash
mvn compile
```

Then enable the Vector API and run its configured main class.

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

The first run may take longer while Maven resolves dependencies. The application prints its training progress, evaluation metrics, and prediction in the terminal.

## What the program does

Regardless of the selected problem, every application performs the same high-level workflow:

```text
load data
-> inspect
-> shuffle and split
-> preprocess
-> build
-> train
-> evaluate
-> save
-> predict
```

Each application saves its trained `.dnet` model under the project's local `models/` directory. Running it again may replace the previously generated model.

## Run from an IDE

When running from an IDE, configure this VM option:

```text
--add-modules jdk.incubator.vector
```

Use the selected project directory as the working directory so that its relative dataset paths resolve correctly.

## Troubleshooting checklist

If an example does not start, check:

- Maven is using Java 25,
- the Vector API module is enabled,
- Deep Netts artifacts and licensing are configured,
- the command is running from the example directory,
- the dataset file is present under `src/main/resources/datasets/`.

For a detailed explanation of every operation, read the README inside the selected example.

<a class="back-button" href="../">← Back to Examples</a>
