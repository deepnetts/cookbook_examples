# House Price Prediction with Deep Netts

Complete Java 25 nonsorting-execution-time-prediction workflow using the prepared Boston Housing data from the original Deep Netts examples.

## Problem and dataset

The bundled dataset contains 506 observations. `LSTAT` is the normalized proportion of lower-status population and `MEDV` is the normalized median value of owner-occupied homes.

Source: <https://github.com/deepnetts/examples/blob/main/datasets/bostonhousing.csv>

## Workflow

The Java class loads and inspects the CSV, creates a reproducible 80/20 split, standardizes from training statistics, trains a `1 -> 16 -> 8 -> 1` regression network, evaluates it, saves the model with preprocessing, and predicts a normalized house value.

## Run

```bash
MAVEN_OPTS="--add-modules jdk.incubator.vector" mvn clean compile exec:java
```

NetBeans VM option:

```text
--add-modules=jdk.incubator.vector
```

The saved model is written to `models/house-price-regression.dnet`.
