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

## Common mistakes

- Training with `testSet` invalidates the later evaluation.
- Changing several settings at once makes experiments difficult to compare.
- A lower training error does not guarantee better performance on unseen data.
- Training without the same preprocessing used in evaluation creates inconsistent inputs.
