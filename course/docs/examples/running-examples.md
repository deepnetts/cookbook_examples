# Running All Examples

The projects listed in [Examples](index.md) are complete, standalone Maven applications. You do not need their source code to read the course. Download them only when you want to run or modify a complete project.

[View Examples on GitHub](https://github.com/deepnetts/cookbook-examples/tree/main/examples/)

Before starting a complete Machine Learning workflow, run [Hello World](../getting-started/index.md#4-hello-world). If Hello World succeeds, the same Java, Maven, Deep Netts, license, and Vector API configuration is ready for these projects.

## Get the example projects

Clone the examples repository, then enter it:

```bash
git clone https://github.com/deepnetts/cookbook-examples.git
cd cookbook-examples
```

Run the remaining commands from the selected example directory. The programs use project-relative paths for datasets and saved models.

## Choose an example

### Simple linear regression

The Sorting Execution Time project predicts a continuous runtime from one input feature:

```bash
cd examples/linear-regression
```

### Multiple linear regression

The Computer Hardware Performance - Multiple Linear Regression project predicts a continuous `PRP` value:

```bash
cd examples/multiple-linear-regression
```

### Spam classification

The Email Spam Classification project predicts a spam probability and binary class:

```bash
cd examples/spam-classification
```

### Multiclass classification

The Iris project predicts one of three flower species from four numerical measurements:

```bash
cd examples/multiclass-classification
```

## Compile the project

From the chosen example directory, run:

```bash
mvn compile
```

This resolves the configured dependencies and compiles the Java source with Java 25.

## Run from a terminal

Enable the Vector API for the Maven process and start the configured main class.

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

The first run may take longer while Maven resolves dependencies. Training output and final evaluation metrics are printed in the terminal.

## What the program does

All examples execute the complete workflow in one run:


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


The simple-regression example predicts sorting execution time. The multiple-regression example predicts relative computer performance. The binary classification example ends with a spam probability and either `SPAM` or `NOT SPAM`. The multiclass example returns three probabilities and predicts an Iris species.

## Generated model files

Each program creates a local `models/` directory and saves a trained `.dnet` model:

```text
linear-regression/models/sorting-execution-time-regression.dnet
multiple-linear-regression/models/computer-hardware-multiple-regression.dnet
spam-classification/models/spam-classifier.dnet
multiclass-classification/models/iris-multiclass-classifier.dnet
```

Re-running an example can replace its local model file with the result of the new training run.

## Run from an IDE

When running from an IDE, configure this VM option:

```text
--add-modules jdk.incubator.vector
```

Also ensure that the working directory is the example project directory. Otherwise, relative dataset paths such as `src/main/resources/datasets/...` will not resolve correctly.

## Troubleshooting checklist

If an example does not start, check:

- Maven is using Java 25,
- the Vector API module is enabled,
- Deep Netts artifacts and licensing are configured,
- the command is running from the example directory,
- the dataset file is present under `src/main/resources/datasets/`.

For a detailed explanation of every operation, read the README inside the selected example.

<a class="back-button" href="../">← Back to Examples</a>
