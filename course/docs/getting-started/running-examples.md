# Running the Examples

The projects under `examples/` are complete, standalone Maven applications. Run each command from the selected example directory because the Java programs use project-relative paths for datasets and saved models.

## Choose an example

### Linear regression

The Computer Hardware Performance Regression project predicts a continuous `PRP` value:

```bash
cd examples/linear-regression
```

[View the project on GitHub](https://github.com/deepnetts/cookbook-examples/tree/main/examples/linear-regression)

### Spam classification

The Email Spam Classification project predicts a spam probability and binary class:

```bash
cd examples/spam-classification
```

[View the project on GitHub](https://github.com/deepnetts/cookbook-examples/tree/main/examples/spam-classification)

## Compile the project

From the chosen example directory, run:

```bash
mvn compile
```

This resolves the configured dependencies and compiles the Java source with Java 22.

## Run from a terminal

Enable the Vector API for the Maven process and start the configured main class:

```bash
MAVEN_OPTS="--add-modules jdk.incubator.vector" mvn exec:java
```

The first run may take longer while Maven resolves dependencies. Training output and final evaluation metrics are printed in the terminal.

## What the program does

Both examples execute the complete workflow in one run:

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

The regression example ends with a predicted relative computer performance value. The classification example ends with a spam probability and either `SPAM` or `NOT SPAM`.

## Generated model files

Each program creates a local `models/` directory and saves a trained `.dnet` model:

```text
linear-regression/models/computer-hardware-regression.dnet
spam-classification/models/spam-classifier.dnet
```

Generated models are ignored by Git. Re-running an example can replace its local model file with the result of the new training run.

## Run from an IDE

When running from an IDE, configure this VM option:

```text
--add-modules jdk.incubator.vector
```

Also ensure that the working directory is the example project directory. Otherwise, relative dataset paths such as `src/main/resources/datasets/...` will not resolve correctly.

## Troubleshooting checklist

If an example does not start, check:

- Maven is using Java 22,
- the Vector API module is enabled,
- Deep Netts artifacts and licensing are configured,
- the command is running from the example directory,
- the dataset file is present under `src/main/resources/datasets/`.

For a detailed explanation of every operation, read the README inside the selected example.
