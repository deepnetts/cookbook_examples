# Training a Model

Configure the network trainer, then train only with the prepared training subset.

## Basic training

```java
import deepnetts.net.train.opt.OptimizerType;

neuralNet.getTrainer()
        .setStopEpochs(300)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.ADAM)
        .setShuffle(true);

neuralNet.train(trainingSet);
```

| Setting | Purpose |
|---|---|
| `setStopEpochs(...)` | Maximum number of passes over the training data |
| `setLearningRate(...)` | Size of each parameter update |
| `setOptimizer(...)` | Algorithm used to update model parameters |
| `setShuffle(true)` | Changes sample order between epochs |

These values are starting points, not universal defaults. A model that does not learn may need a different learning rate, architecture, preprocessing choice, or more training.

## Mini-batch training

For a larger dataset, enable batches explicitly:

```java
neuralNet.getTrainer()
        .setStopEpochs(50)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.SGD)
        .setBatchMode(true)
        .setBatchSize(64)
        .setShuffle(true);

neuralNet.train(trainingSet);
```

## Train a CNN

CNNs use the same trainer API, but image batches consume more memory and each
epoch usually takes longer than it does for a small tabular model:

```java
network.getTrainer()
        .setStopEpochs(20)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.ADAM)
        .setBatchMode(true)
        .setBatchSize(8)
        .setShuffle(true);

network.train(trainingSet);
```

Start with a batch size that fits available memory. Compare training and
held-out metrics across epochs; a successful smoke test confirms that the
pipeline runs, but one epoch is not evidence that the CNN has converged.

## Stop on an error target

Training can also stop when it reaches a configured error:

```java
neuralNet.getTrainer()
        .setStopError(0.03f)
        .setStopEpochs(350)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.ADAM);
```

Keep an epoch limit even when using an error target so a run cannot continue indefinitely.

??? danger "Common mistakes"
    - Training with `testSet` invalidates the later evaluation.
    - Changing several settings at once makes experiments difficult to compare.
    - A lower training error does not guarantee better performance on unseen data.
    - Training without the same preprocessing used in evaluation creates inconsistent inputs.
    - Augmenting or otherwise changing `testSet` prevents a clean held-out evaluation.

??? info "See it in practice"
    - [Logistic Regression](../examples/classification/sonar-rock-mine-classification.md) trains a compact baseline with SGD.
    - [Spam Classification](../examples/classification/email-spam-detection.md) demonstrates mini-batch training on a larger dataset.
    - [Parking Lot Occupancy](../examples/image-classification/parking-lot-occupancy.md) demonstrates why an image epoch takes longer than a tabular epoch.
    - [Credit Card Fraud Detection](../examples/classification/credit-card-fraud-detection.md) demonstrates mini-batch SGD training on balanced transaction data.
    - [House Price Prediction](../examples/regression/house-price-prediction.md) trains a nonlinear regressor with SGD.
