# Insurance Payment Prediction with Deep Netts

Complete Java 25 simple-sorting-execution-time-prediction workflow for predicting total Swedish auto-insurance payments from the number of claims.

## Problem and dataset

The bundled dataset contains 63 normalized pairs. The first value is the number of claims and the second is total payment for all claims. It comes from the Swedish Auto Insurance dataset used by the original Deep Netts examples.

Source: <https://github.com/deepnetts/examples/blob/main/datasets/SweedenAutoInsurance.csv>

## Workflow

The Java class loads the CSV, creates a reproducible 80/20 split, standardizes from training statistics, trains a `1 -> 1` linear network, evaluates it, saves the model with preprocessing, and predicts payment for a new claim count.

## Run

```bash
MAVEN_OPTS="--add-modules jdk.incubator.vector" mvn clean compile exec:java
```

NetBeans VM option:

```text
--add-modules=jdk.incubator.vector
```

The saved model is written to `models/insurance-payment-regression.dnet`.
