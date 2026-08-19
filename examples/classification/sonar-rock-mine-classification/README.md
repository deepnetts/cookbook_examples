# Logistic Regression with Deep Netts

This Java 25 Maven project performs binary Sonar classification with logistic regression.

Unlike the Spam Classification neural network, this model has no hidden layers. It connects the input features directly to one Sigmoid output and trains with Cross-Entropy loss.

The dataset contains 60 numerical sonar-signal features and one binary target in the final column:

- `0` — rock
- `1` — mine

The dataset is stored at `src/main/resources/datasets/sonar.csv`.

## Compile

Compile the project with:

```bash
mvn clean compile
```

## Run

Run the complete example with:

```bash
MAVEN_OPTS="--add-modules jdk.incubator.vector" mvn clean compile exec:java
```

The complete flow runs in one Java file:

```text
load data
-> inspect
-> shuffle and split
-> fit and apply Min-Max scaling
-> build sonar-rock-mine-classification model
-> train
-> evaluate trained model
-> save with FileIO
-> predict with trained model
```

The model is stored at `models/sonar-rock-mine-classification.dnet`. The final prediction
uses the trained `FeedForwardNetwork` and an example taken directly from
the preprocessed test set, not a hard-coded sonar sample.
