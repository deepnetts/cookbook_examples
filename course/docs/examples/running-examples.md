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
| Simple Linear Regression | `examples/regression/sorting-execution-time-prediction` | Sorting execution time |
| Multiple Linear Regression | `examples/regression/computer-hardware-performance-prediction` | Relative computer performance |
| Logistic Regression | `examples/classification/sonar-rock-mine-classification` | Sonar rock-or-mine probability and class |
| Spam Classification | `examples/classification/email-spam-detection` | Spam probability and class |
| Multiclass Classification | `examples/classification/iris-flower-classification` | Iris species probabilities and class |
| Hot Dog or Not Hot Dog | `examples/img-classification/hotdog-nothotdog` | Hot-dog probability and class |
| Duke Logo Recognition | `examples/img-classification/duke-logo-recognition` | Duke-logo probability and class |
| Parking Lot Occupancy | `examples/img-classification/parking-lot-occupancy` | Occupancy probability and class |
| Handwritten Digit Recognition | `examples/img-classification/handwritten-digit-recognition` | MNIST digit and confidence |
| Lego Figure Recognition | `examples/img-classification/lego-figure-recognition` | Lego-figure probability and class |
| TensorFlow VGGNet16 Import | `examples/img-classification/tensorflow-vggnet16-import` | ImageNet label and confidence |

For example:

```bash
cd examples/regression/sorting-execution-time-prediction
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

For a one-epoch smoke test of an image-training example, use:

```text
--add-modules=jdk.incubator.vector -Ddeepnetts.epochs=1
```

This completes loading, training, evaluation, model saving, and prediction,
but one epoch is not intended to produce final model accuracy.

TensorFlow VGGNet16 is an import and inference example, so the epoch option
does not apply. It needs a larger heap:

```text
--add-modules=jdk.incubator.vector -Xmx8g
```

Its first run downloads approximately 600 MB of exported TensorFlow weights.
It does not download the ImageNet training dataset.

## Troubleshooting checklist

If an example does not start, check:

- Maven is using Java 25,
- the Vector API module is enabled,
- Deep Netts artifacts and licensing are configured,
- the command is running from the example directory,
- the dataset file is present under `src/main/resources/datasets/`.

For a detailed explanation of every operation, read the README inside the selected example.

<a class="back-button" href="../">← Back to Examples</a>
