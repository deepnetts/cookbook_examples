# Credit Card Fraud Detection with Deep Netts

Complete Java 25 binary-classification workflow for identifying fraudulent credit-card transactions.

## Problem and dataset

The bundled `creditcard-balanced.csv` is the balanced subset published with the original Deep Netts example. It contains 999 transactions, 28 anonymized PCA features, transaction `Amount`, and binary target `Class` (`0` legitimate, `1` fraud).

Source: <https://github.com/deepnetts/CreditCardFraudDetection>

## Workflow

The Java class loads and inspects the CSV, creates a reproducible 80/20 split, fits `MinMaxScaler` only on training data, trains a `29 -> 32 -> 16 -> 1` network, evaluates it, saves the model with preprocessing, and predicts one held-out transaction.

## Run

Requirements: Java 25, Maven, Deep Netts 4 Pro artifacts and license installed as described by the course.

```bash
MAVEN_OPTS="--add-modules jdk.incubator.vector" mvn clean compile exec:java
```

In NetBeans, set the VM option:

```text
--add-modules=jdk.incubator.vector
```

The saved model is written to `models/credit-card-fraud-detector.dnet`.
