<a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/classification/credit-card-fraud-detection">View Example on GitHub</a>

# Credit Card Fraud Detection

This walkthrough builds a binary classifier that estimates whether a credit-card transaction is fraudulent.

**Problem:** Classify a transaction as `LEGITIMATE` or `FRAUD`.

**Dataset:** 999 balanced transactions with 28 anonymized PCA features, transaction amount, and one binary target.

## At a glance

| | |
|---|---|
| **ML task** | Binary classification |
| **Inputs** | `V1`-`V28` and `Amount` |
| **Target** | `Class`: `0` legitimate, `1` fraud |
| **Model** | `29 -> 32 -> 16 -> 1` with Sigmoid output |
| **Preprocessing** | Min-max scaling fitted on training data |

## 1. Load and inspect transactions

```java
TabularDataSet<MLDataItem> dataSet = DataSets.readCsv(
        DATASET_PATH, 29, 1, true, ",");

System.out.println("Samples: " + dataSet.size());
System.out.println(Arrays.toString(dataSet.getColumnNames()));
```

The balanced subset makes the learning flow practical while retaining both fraud and legitimate transactions.

## 2. Create held-out data

```java
dataSet.shuffle(42);
TrainTestSplit split = dataSet.trainTestSplit(0.8);
DataSet<MLDataItem> trainingSet = split.getTrainingSet();
DataSet<MLDataItem> testSet = split.getTestSet();
```

## 3. Scale without data leakage

```java
MinMaxScaler scaler = DataSets.scaleToMinMax(trainingSet);
scaler.apply(testSet);
```

Only the training set determines scaling parameters. The test set remains unseen evidence for evaluation.

## 4. Build the fraud detector

```java
FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
        .addInputLayer(29)
        .addFullyConnectedLayer(32)
        .addFullyConnectedLayer(16)
        .addOutputLayer(1, ActivationType.SIGMOID)
        .lossFunction(LossType.CROSS_ENTROPY)
        .randomSeed(42)
        .build();
```

## 5. Train the model

```java
neuralNet.getTrainer()
        .setStopEpochs(100)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.SGD)
        .setBatchMode(true)
        .setBatchSize(32)
        .setShuffle(true);

neuralNet.train(trainingSet);
```

## 6. Evaluate the classifier

```java
ClassificationMetrics metrics =
        (ClassificationMetrics) neuralNet.test(testSet);
System.out.println(metrics);
```

For fraud detection, inspect precision and recall together rather than relying only on accuracy.

## 7. Save the model

```java
neuralNet.setNormalizer(scaler);
Files.createDirectories(Path.of("models"));
neuralNet.save(MODEL_PATH);
```

## 8. Predict fraud probability

```java
float probability = neuralNet.predict(exampleTransaction)[0];
String predictedClass = probability >= 0.5f ? "FRAUD" : "LEGITIMATE";
```

## What you built

```text
29 transaction features
        ↓
Leakage-safe scaling
        ↓
Binary neural classifier
        ↓
Fraud probability and class
```

<div class="github-project-action">
<a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/classification/credit-card-fraud-detection">View Example on GitHub</a>
</div>

<a class="back-button" href="../">← Back to Classification Examples</a>
