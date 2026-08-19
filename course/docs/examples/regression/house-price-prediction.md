<a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/regression/house-price-prediction">View Example on GitHub</a>

# House Price Prediction

This walkthrough builds a nonlinear regression model for prepared Boston Housing data.

**Problem:** Predict normalized median house value (`MEDV`) from normalized lower-status population percentage (`LSTAT`).

**Dataset:** 506 prepared Boston Housing observations.

## At a glance

| | |
|---|---|
| **ML task** | Nonlinear regression |
| **Input** | Normalized `LSTAT` |
| **Target** | Normalized `MEDV` |
| **Model** | `1 -> 16 -> 8 -> 1` |

## 1. Load and inspect housing data

```java
TabularDataSet<MLDataItem> dataSet = DataSets.readCsv(
        DATASET_PATH, 1, 1, true, ",");
System.out.println(Arrays.toString(dataSet.getColumnNames()));
```

## 2. Split and standardize

```java
dataSet.shuffle(42);
TrainTestSplit split = dataSet.trainTestSplit(0.8);
DataSet<MLDataItem> trainingSet = split.getTrainingSet();
DataSet<MLDataItem> testSet = split.getTestSet();

Standardizer standardizer = new Standardizer(trainingSet);
standardizer.apply(trainingSet);
standardizer.apply(testSet);
```

## 3. Build the regression network

```java
FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
        .addInputLayer(1)
        .addFullyConnectedLayer(16, ActivationType.TANH)
        .addFullyConnectedLayer(8, ActivationType.TANH)
        .addOutputLayer(1, ActivationType.LINEAR)
        .lossFunction(LossType.MEAN_SQUARED_ERROR)
        .randomSeed(42)
        .build();
```

The hidden layers let the model learn a nonlinear relationship between `LSTAT` and house value.

## 4. Train the model

```java
neuralNet.getTrainer()
        .setStopEpochs(1000)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.SGD)
        .setShuffle(true);
neuralNet.train(trainingSet);
```

## 5. Evaluate the model

```java
RegressionMetrics metrics =
        (RegressionMetrics) neuralNet.test(testSet);
System.out.println(metrics);
```

## 6. Save the model

```java
neuralNet.setNormalizer(standardizer);
Files.createDirectories(Path.of("models"));
neuralNet.save(MODEL_PATH);
```

## 7. Predict a house value

```java
float normalizedLstat = 0.12f;
float predictedValue = neuralNet.predict(normalizedLstat)[0];
```

## What you built

```text
Normalized LSTAT
        ↓
Nonlinear regression network
        ↓
Predicted normalized MEDV
```

<div class="github-project-action">
<a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/regression/house-price-prediction">View Example on GitHub</a>
</div>

<a class="back-button" href="../">← Back to Regression Examples</a>
