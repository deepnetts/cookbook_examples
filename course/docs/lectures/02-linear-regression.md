# Linear Regression

Linear regression is the clearest bridge between basic Machine Learning and neural networks. It predicts a continuous value by learning the straight-line relationship that best describes the training data.

## Intuition

### Fit the best line

Suppose a benchmark records sorting comparisons and execution time. Measurements vary, but the overall trend can be represented by a line:

<figure class="course-figure">
  <img src="../../assets/course-figures/linear-regression-fit.svg" alt="Scatter plot of sorting comparison count and execution time with a fitted regression line and residuals">
  <figcaption>The fitted line captures the overall trend; each residual is the distance between an observed measurement and its prediction.</figcaption>
</figure>

For one input feature, the model is:

$$
\hat{y}=wx+b
$$

- $x$ is the input;
- $w$ is the learned weight or slope;
- $b$ is the learned bias or intercept;
- $\hat{y}$ is the prediction.

The model learns the overall relationship instead of memorizing each row.

### Why this is a neural network

A single Linear neuron calculates the same equation:

```text
input x -- weight w --+
                      +--> weighted sum + bias --> linear output
constant 1 -- bias b -+
```

In Deep Netts this is a `1 -> 1` network: one input, no hidden layers, and one output with Linear activation. It is the smallest useful neural network.

## Measure the error

For sample $i$, the residual is:

$$
e_i=y_i-\hat{y}_i
$$

Mean Squared Error averages squared residuals:

$$
\operatorname{MSE}=\frac{1}{n}\sum_{i=1}^{n}(y_i-\hat{y}_i)^2
$$

Squaring prevents positive and negative errors from cancelling and penalizes large misses more strongly.

## Simple linear regression with Deep Netts

The runnable [Sorting Execution Time walkthrough](../examples/regression/sorting-execution-time-prediction.md) predicts `execution_time_ms` from `comparison_count`.

### Load, shuffle, and split

```java
TabularDataSet<MLDataItem> dataSet = DataSets.readCsv(
        DATASET_PATH, NUM_INPUTS, NUM_OUTPUTS, true, ",");

dataSet.shuffle(42);
TrainTestSplit split = dataSet.trainTestSplit(0.8);
DataSet<MLDataItem> trainingSet = split.getTrainingSet();
DataSet<MLDataItem> testSet = split.getTestSet();
```

The fixed seed makes the split reproducible. The test set remains unseen until evaluation.

### Standardize the data

```java
Standardizer standardizer = new Standardizer(trainingSet);
standardizer.apply(trainingSet);
standardizer.apply(testSet);
```

Fit preprocessing on training data only. Applying test statistics during training would leak information and make evaluation look more reliable than it is.

### Build the model

```java
FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
        .addInputLayer(NUM_INPUTS)
        .addOutputLayer(NUM_OUTPUTS, ActivationType.LINEAR)
        .lossFunction(LossType.MEAN_SQUARED_ERROR)
        .randomSeed(42)
        .build();
```

There is no hidden nonlinear transformation, so the network learns $\hat{y}=wx+b$.

### Train the model

```java
neuralNet.getTrainer()
        .setStopEpochs(3000)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.SGD)
        .setShuffle(true);

neuralNet.train(trainingSet);
```

The learning rate controls update size. Too large can make loss unstable; too small can make learning unnecessarily slow.

### Evaluate and predict

```java
RegressionMetrics metrics = (RegressionMetrics) neuralNet.test(testSet);
System.out.println(metrics);

neuralNet.setNormalizer(standardizer);
float comparisonCount = 100_000;
float predictedExecutionTime = neuralNet.predict(comparisonCount)[0];
```

Attaching the fitted normalizer lets raw future inputs receive the same transformation used during training.

| Metric | Meaning |
|---|---|
| $R^2$ | Proportion of target variance explained by the model |
| MSE | Average squared error |
| RMSE | Error magnitude in target units |
| MAE | Average absolute error |
| Maximum error | Largest individual prediction miss |

Training loss and held-out metrics answer different questions. Use the test metrics to judge generalization.

## Multiple linear regression

With $m$ features, the model becomes:

$$
\hat{y}=w_1x_1+w_2x_2+\cdots+w_mx_m+b
$$

The [Computer Hardware Performance walkthrough](../examples/regression/computer-hardware-performance-prediction.md) uses six inputs:

```text
MYCT, MMIN, MMAX, CACH, CHMIN, CHMAX -> PRP
```

```java
FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
        .addInputLayer(6)
        .addOutputLayer(1, ActivationType.LINEAR)
        .lossFunction(LossType.MEAN_SQUARED_ERROR)
        .randomSeed(42)
        .build();
```

The `6 -> 1` network still learns a linear relationship, now represented by a plane or hyperplane rather than a two-dimensional line.

## Gradient descent

Training repeats:

1. create predictions with a forward pass;
2. calculate loss;
3. calculate each parameter's gradient;
4. update parameters in the direction that reduces loss.

For weight $w$:

$$
w_{new}=w_{old}-\eta\frac{\partial L}{\partial w}
$$

$\eta$ is the learning rate. The gradient describes how the loss changes when the weight changes.

## When a line is not enough

Linear regression cannot bend around a nonlinear relationship. Hidden layers with nonlinear activations change the model family:

```text
Linear regression:    input -> Linear output
Nonlinear regression: input -> Tanh/ReLU hidden layers -> Linear output
```

The [House Price Prediction walkthrough](../examples/regression/house-price-prediction.md) demonstrates a `1 -> 16 -> 8 -> 1` nonlinear regression network.

## Practical checklist

- Use regression for a continuous target.
- Keep feature order consistent.
- Split before fitting preprocessing.
- Use Linear activation at the regression output.
- Evaluate on held-out data using several metrics.
- Save preprocessing with the trained model.
- Add hidden layers only when a linear relationship is insufficient.

## Continue learning

Continue with [Neural Networks](02-neural-networks.md), then use [Backpropagation](05-backpropagation.md) to examine how Deep Netts calculates the gradients that train every layer.
