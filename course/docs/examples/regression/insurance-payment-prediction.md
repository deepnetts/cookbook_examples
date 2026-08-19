<a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/regression/insurance-payment-prediction">View Example on GitHub</a>

# Insurance Payment Prediction

This walkthrough uses simple linear regression to estimate total Swedish auto-insurance payments from the number of claims.

**Dataset:** 63 normalized claim-count and payment pairs from the Swedish Auto Insurance dataset.

## At a glance

| | |
|---|---|
| **ML task** | Simple linear regression |
| **Input** | Normalized claim count |
| **Target** | Normalized total payment |
| **Model** | `1 -> 1` linear network |

## 1. Load the dataset

```java
TabularDataSet<MLDataItem> dataSet = DataSets.readCsv(
        DATASET_PATH, 1, 1, false, ",");
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

## 3. Build the linear model

```java
FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
        .addInputLayer(1)
        .addOutputLayer(1, ActivationType.LINEAR)
        .lossFunction(LossType.MEAN_SQUARED_ERROR)
        .randomSeed(42)
        .build();
```

## 4. Train the model

```java
neuralNet.getTrainer()
        .setStopEpochs(1500)
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

## 7. Predict a payment

```java
float normalizedClaimCount = 0.25f;
float predictedPayment = neuralNet.predict(normalizedClaimCount)[0];
```

## What you built

```text
Claim count → linear model → predicted total payment
```

<div class="github-project-action">
<a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/regression/insurance-payment-prediction">View Example on GitHub</a>
</div>

<a class="back-button" href="../">← Back to Regression Examples</a>
