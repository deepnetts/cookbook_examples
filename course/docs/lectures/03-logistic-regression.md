# Logistic Regression

Logistic regression is a binary classifier: it predicts which of two classes a sample belongs to. It is the natural step between Linear Regression and multilayer Neural Networks because it keeps the same weighted linear calculation and changes how the result is interpreted.

Typical questions include:

- Is an email spam or not spam?
- Is a transaction legitimate or fraudulent?
- Does a sonar signal represent a rock or a mine?

Each problem has a target encoded with two possible values, commonly `0` and `1`.

## From values to decisions

Linear regression predicts a continuous value. Binary classification instead needs a boundary that separates two classes.

<figure class="course-figure">
  <img src="../../assets/course-figures/logistic-decision-boundary.svg" alt="Two classes of samples separated by a learned linear decision boundary">
  <figcaption>Logistic regression learns a linear boundary. The side of the boundary determines the predicted class.</figcaption>
</figure>

For features $x_1, x_2, \ldots, x_m$, the model first calculates the same weighted score used by linear regression:

$$
z=w_1x_1+w_2x_2+\cdots+w_mx_m+b
$$

The score $z$ can be any real number. A Sigmoid activation converts it into a probability:

$$
\sigma(z)=\frac{1}{1+e^{-z}}
$$

The result is always between `0` and `1`:

- a value near `1` indicates strong evidence for the positive class;
- a value near `0` indicates strong evidence for the negative class;
- `0.5` represents the default decision boundary.

<figure class="course-figure">
  <img src="../../assets/course-figures/logistic-probability-flow.svg" alt="Features transformed into a linear score, Sigmoid probability, and binary class">
  <figcaption>Logistic regression separates probability estimation from the final threshold-based decision.</figcaption>
</figure>

With a threshold of $0.5$:

$$
\hat{y}=\begin{cases}
1 & \text{if } \sigma(z) \geq 0.5 \\
0 & \text{if } \sigma(z) < 0.5
\end{cases}
$$

The probability is often more useful than the class alone because an application can choose a different threshold when false positives and false negatives have different costs.

## Connection to Linear Regression

Both models learn weights and a bias. Their output activations give the result a different meaning.

<figure class="course-figure">
  <img src="../../assets/course-figures/linear-vs-logistic-model.svg" alt="Linear and Logistic Regression both calculate a weighted score, but use Linear and Sigmoid output activations respectively">
  <figcaption>Linear Regression returns the weighted score directly; Logistic Regression transforms it into a probability.</figcaption>
</figure>

| Property | Linear Regression | Logistic Regression |
|---|---|---|
| Task | Predict a continuous value | Predict one of two classes |
| Output activation | Linear | Sigmoid |
| Output range | Any real number | Probability between `0` and `1` |
| Typical loss | Mean Squared Error | Cross-Entropy |
| Deep Netts output | One Linear value | One Sigmoid probability |

Logistic regression is also the smallest binary neural network. It has no hidden layer:

```text
features -> weighted sum + bias -> Sigmoid -> probability
```

Without hidden layers, it can learn only a linear decision boundary. Hidden layers introduced in the next lesson allow a classifier to learn nonlinear boundaries.

## Logistic Regression with Deep Netts

The runnable [Sonar Rock or Mine walkthrough](../examples/classification/sonar-rock-mine-classification.md) applies logistic regression to 208 sonar observations. Each sample contains 60 numerical signal features and one binary target:

- `0` means `ROCK`;
- `1` means `MINE`.

### Load, split, and scale the data

Read the dataset with 60 inputs and one output:

```java
TabularDataSet<MLDataItem> dataSet = DataSets.readCsv(
        DATASET_PATH, 60, 1, false, ",");
```

Shuffle deterministically and create separate training and test sets:

```java
dataSet.shuffle(42);
TrainTestSplit split = dataSet.trainTestSplit(0.8);

DataSet<MLDataItem> trainingSet = split.getTrainingSet();
DataSet<MLDataItem> testSet = split.getTestSet();
```

Fit Min-Max scaling only on the training data, then apply the fitted scaler to the test set:

```java
MinMaxScaler scaler = DataSets.scaleToMinMax(trainingSet);
scaler.apply(testSet);
```

This ordering prevents test information from leaking into preprocessing.

### Build the classifier

The model connects all 60 inputs directly to one Sigmoid output:

```java
FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
        .addInputLayer(60)
        .addOutputLayer(1, ActivationType.SIGMOID)
        .lossFunction(LossType.CROSS_ENTROPY)
        .randomSeed(42)
        .build();
```

The absence of `.addFullyConnectedLayer(...)` is important: this is logistic regression, not a multilayer classifier.

### Train and evaluate

Configure the trainer and learn the weights and bias:

```java
neuralNet.getTrainer()
        .setStopEpochs(200)
        .setLearningRate(0.01f)
        .setOptimizer(OptimizerType.SGD)
        .setShuffle(true);

neuralNet.train(trainingSet);
```

Evaluate on samples that were not used to fit the model:

```java
ClassificationMetrics metrics = (ClassificationMetrics) neuralNet.test(testSet);
System.out.println(metrics);
```

Classification metrics should be read together:

| Metric | Question it answers |
|---|---|
| Accuracy | How often is the classifier correct overall? |
| Precision | When it predicts the positive class, how often is it correct? |
| Recall | Of all actual positive samples, how many did it find? |
| F1 Score | How well are precision and recall balanced? |
| Specificity | How often does it correctly recognize the negative class? |

### Predict a class

`predict` returns the positive-class probability. The application applies the threshold:

```java
float mineProbability = neuralNet.predict(sonarSignal)[0];
String predictedClass = mineProbability >= 0.5f ? "MINE" : "ROCK";
```

The model returns evidence; the threshold turns that evidence into an application decision.

## Why Binary Cross-Entropy?

For one binary sample, Binary Cross-Entropy is:

$$
L=-\left[y\log(\hat{y})+(1-y)\log(1-\hat{y})\right]
$$

$y$ is the actual label and $\hat{y}$ is the predicted probability. Across $n$ samples, training minimizes the average:

$$
L=-\frac{1}{n}\sum_{i=1}^{n}\left[y_i\log(\hat{y}_i)+(1-y_i)\log(1-\hat{y}_i)\right]
$$

<figure class="course-figure">
  <img src="../../assets/course-figures/cross-entropy-confidence.svg" alt="Binary Cross-Entropy loss increasing as a positive example receives a lower predicted probability">
  <figcaption>Binary Cross-Entropy gives a small penalty to confident correct predictions and a large penalty to confident wrong predictions. In the Deep Netts builder, it is selected with <code>LossType.CROSS_ENTROPY</code>.</figcaption>
</figure>

Sigmoid and Cross-Entropy form a useful pair. For logistic regression, their gradient simplifies to an error term multiplied by the feature value:

$$
\frac{\partial L}{\partial w_j}=\frac{1}{n}\sum_{i=1}^{n}(\hat{y}_i-y_i)x_{ij}
$$

Gradient descent uses these derivatives to update every weight and the bias. The [Backpropagation](05-backpropagation.md) lesson develops this training process in detail.

## The decision boundary

The default threshold changes class when $\sigma(z)=0.5$. Because $\sigma(0)=0.5$, the boundary is:

$$
w_1x_1+w_2x_2+\cdots+w_mx_m+b=0
$$

With two features this equation describes a line. With three features it describes a plane, and with more features it describes a hyperplane.

This linear boundary is the model's main limitation. If the two classes require a curved or more complex separation, add hidden layers with nonlinear activation functions and use a neural-network classifier.

## Practical checklist

- Use Logistic Regression for a binary target.
- Encode the two classes consistently as `0` and `1`.
- Split the data before fitting preprocessing.
- Use one Sigmoid output with Cross-Entropy loss.
- Start with a `0.5` threshold, then tune it for application costs if necessary.
- Evaluate precision, recall, F1, and specificity alongside accuracy.
- Add hidden layers only when a linear decision boundary is insufficient.

## Continue learning

Continue with [Neural Networks](02-neural-networks.md) to add hidden layers and learn nonlinear feature transformations.

To run the model from this lesson first, use the [Sonar Rock or Mine walkthrough](../examples/classification/sonar-rock-mine-classification.md).
