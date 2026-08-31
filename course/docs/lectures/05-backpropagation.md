# Backpropagation

When `neuralNet.train(trainingSet)` runs, Deep Netts performs a forward pass, calculates loss, propagates gradients backward, and updates every trainable weight and bias. Backpropagation is the algorithm that calculates those gradients.

## The learning loop

<figure class="course-figure">
  <img src="../../assets/course-figures/backpropagation-loop.svg" alt="Neural-network learning loop with a forward pass, loss, backward gradients, and optimizer update">
  <figcaption>Predictions and loss move forward; gradients move backward; the optimizer applies the update before the next pass.</figcaption>
</figure>

The network is not told the correct weights. It learns through many small parameter changes that reduce prediction error.

## Forward pass

A neuron calculates a weighted sum and activation:

$$
z=\sum_{i=1}^{m}w_ix_i+b
$$

$$
a=f(z)
$$

Each layer's activations become the next layer's inputs. The output layer produces a numerical value or class probabilities.

## Loss functions

Loss converts prediction quality into one value the trainer can minimize.

### Mean Squared Error

Regression commonly uses:

$$
L_{MSE}=\frac{1}{n}\sum_{i=1}^{n}(y_i-\hat{y}_i)^2
$$

```java
.lossFunction(LossType.MEAN_SQUARED_ERROR)
```

### Cross-entropy

Classification commonly uses:

$$
L_{CE}=-\sum_{c=1}^{C}y_c\log(\hat{y}_c)
$$

```java
.lossFunction(LossType.CROSS_ENTROPY)
```

Cross-entropy works naturally with Sigmoid or Softmax probability outputs.

## Backward pass

Backpropagation moves from the loss toward earlier layers. A gradient answers: if this parameter changed slightly, how would the loss change?

<figure class="course-figure">
  <img src="../../assets/course-figures/backward-gradient-flow.svg" alt="Gradients flowing backward from loss through output and hidden-layer gradients toward earlier layers">
  <figcaption>The loss starts the training signal, and the chain rule carries gradients from the output toward every earlier trainable layer.</figcaption>
</figure>

Backpropagation supplies gradients. The optimizer uses them to change parameters.

## Chain rule

Neural networks are nested functions. For $L(f(g(x)))$:

$$
\frac{\partial L}{\partial x}
=\frac{\partial L}{\partial f}
 \frac{\partial f}{\partial g}
 \frac{\partial g}{\partial x}
$$

For one output neuron:

$$
z=wx+b,\qquad \hat{y}=f(z),\qquad L=L(\hat{y},y)
$$

the weight gradient is:

$$
\frac{\partial L}{\partial w}
=\frac{\partial L}{\partial \hat{y}}
 \frac{\partial \hat{y}}{\partial z}
 \frac{\partial z}{\partial w}
$$

The same pattern repeats through all layers. Forward-pass values are reused during the backward pass.

## Optimizer and learning rate

Basic gradient descent updates parameter $\theta$ with:

$$
\theta_{new}=\theta_{old}-\eta\nabla_{\theta}L
$$

$\eta$ is the learning rate.

```java
neuralNet.getTrainer()
        .setStopEpochs(1000)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.SGD)
        .setShuffle(true);
```

The current API configures training through `neuralNet.getTrainer()`. Older snippets using `BackpropagationTrainer`, `setMaxEpochs`, `setInput`, or `getOutput` should not be copied into Deep Netts 4 projects.

## Epochs and batches

An epoch is one pass through the training dataset. Depending on configuration, updates can happen for individual samples or batches.

```text
epoch 1: visit rows -> gradients -> updates
epoch 2: reshuffle  -> gradients -> updates
...
```

`setStopEpochs` is an upper limit. Training can finish earlier when another stopping condition is satisfied. Shuffling reduces the influence of row order.

## Current Deep Netts classification flow

The following structure matches the runnable [Iris Flower walkthrough](../examples/classification/iris-flower-classification.md).

### Load and split

```java
TabularDataSet<MLDataItem> dataSet = DataSets.readCsv(
        DATASET_PATH, NUM_INPUTS, NUM_OUTPUTS, true, ",");

dataSet.shuffle(42);
TrainTestSplit split = dataSet.trainTestSplit(0.8);
DataSet<MLDataItem> trainingSet = split.getTrainingSet();
DataSet<MLDataItem> testSet = split.getTestSet();
```

### Fit preprocessing without leakage

```java
MinMaxScaler scaler = DataSets.scaleToMinMax(trainingSet);
scaler.apply(testSet);
```

### Build the network

```java
FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
        .addInputLayer(4)
        .addFullyConnectedLayer(16, ActivationType.TANH)
        .addOutputLayer(3, ActivationType.SOFTMAX)
        .lossFunction(LossType.CROSS_ENTROPY)
        .randomSeed(42)
        .build();
```

### Train and evaluate

```java
neuralNet.getTrainer()
        .setStopError(0.03f)
        .setStopEpochs(350)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.ADAM);

neuralNet.train(trainingSet);
ClassificationMetrics metrics =
        (ClassificationMetrics) neuralNet.test(testSet);
```

Training output measures optimization on the training subset. `ClassificationMetrics` evaluates unseen examples.

## Learning-rate experiments

| Learning rate | Typical result |
|---|---|
| Too small | Loss improves very slowly |
| Suitable | Loss decreases and stabilizes |
| Too large | Loss oscillates, diverges, or becomes non-finite |

Change one variable at a time and create a fresh network for every experiment:

```java
float[] learningRates = {0.0001f, 0.001f, 0.01f};

for (float learningRate : learningRates) {
    FeedForwardNetwork neuralNet = buildNetwork();
    neuralNet.getTrainer()
            .setStopEpochs(1000)
            .setLearningRate(learningRate)
            .setOptimizer(OptimizerType.SGD)
            .setShuffle(true);
    neuralNet.train(trainingSet);
}
```

Reusing an already trained network would invalidate the comparison.

## Architecture experiments

Backpropagation works for linear and multilayer models:

```text
linear:     4 -> 3
one hidden: 4 -> 16 -> 3
two hidden: 4 -> 16 -> 8 -> 3
```

For a fair comparison, keep the split, preprocessing, random seed, optimizer, learning rate, and stopping rules equal. Compare held-out metrics rather than training loss alone. More layers add capacity but can overfit small datasets.

## Activation derivatives

For Sigmoid:

$$
\sigma(z)=\frac{1}{1+e^{-z}},\qquad
\sigma'(z)=\sigma(z)(1-\sigma(z))
$$

For Tanh:

$$
\tanh'(z)=1-\tanh^2(z)
$$

For ReLU away from zero:

$$
\operatorname{ReLU}'(z)=
\begin{cases}
0 & z<0\\
1 & z>0
\end{cases}
$$

These derivatives become factors in the chain rule.

## Vanishing and exploding gradients

Multiplying many derivatives smaller than one can leave early layers with an almost-zero gradient. This is the vanishing-gradient problem. Repeatedly large factors can produce exploding gradients.

Practical responses include:

- scale numerical inputs;
- use suitable activations such as ReLU in deeper hidden layers;
- choose a conservative learning rate;
- avoid unnecessary depth;
- monitor loss for instability and non-finite values.

## Diagnose training

- Falling error shows progress on training data.
- Flat error can mean convergence, weak gradients, or unsuitable settings.
- Oscillation often indicates an excessive learning rate.
- Strong training results with weak test metrics suggest overfitting.
- Regression “accuracy” can be negative early in training; interpret it with regression loss and held-out metrics.

## Practical checklist

- Match output activation and loss to the task.
- Split before fitting preprocessing.
- Use reproducible seeds for comparisons.
- Change one experimental variable at a time.
- Treat epoch count as an upper limit when other stopping rules exist.
- Evaluate on held-out data.
- Save preprocessing with the trained model.

## Continue learning

Continue with [Convolutional Neural Networks](06-convolutional-neural-networks.md) to see how the same training process learns reusable spatial filters for images.
