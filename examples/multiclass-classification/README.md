# Iris Multiclass Classification with Deep Netts

This example demonstrates a complete **multiclass classification workflow** using Deep Netts.

The model uses four flower measurements to classify an Iris flower as one of three species. Its structure intentionally follows the spam-classification example so that the differences between binary and multiclass classification are easy to compare.

## Problem

The three target classes are:

```text
SETOSA
VERSICOLOR
VIRGINICA
```

Unlike binary classification, the network returns three probabilities. The class with the largest probability becomes the prediction.

## Dataset

The included Iris dataset contains 150 samples, with 50 samples for each of the three classes. It has no empty values and each target is already one-hot encoded.

The dataset is located at:

```text
src/main/resources/datasets/iris-flowers.csv
```

The example is currently prepared for four numerical input features measured in centimeters:

| Feature | Description |
|---|---|
| `sepal_length` | Sepal length |
| `sepal_width` | Sepal width |
| `petal_length` | Petal length |
| `petal_width` | Petal width |

The Java code expects three one-hot encoded target columns after the four input columns:

```csv
setosa,versicolor,virginica
1,0,0
0,1,0
0,0,1
```

Deep Netts reads the first four columns as inputs and the last three columns as expected outputs. Update the constants and class names in the Java file if the supplied dataset uses a different representation.

## Project Structure

```text
multiclass-classification/
├── README.md
├── pom.xml
└── src/
    └── main/
        ├── java/
        │   └── com/deepnetts/examples/multiclassclassification/
        │       └── MulticlassClassificationDeepNetts.java
        └── resources/
            └── datasets/
                └── iris-flowers.csv
```

The generated model is saved locally under `models/` and is ignored by Git.

## Requirements

```text
Java 25
Maven
Deep Netts 4.0.0-beta
```

Deep Netts 4 uses the Java Vector API. Add this VM option when running the example:

```text
--add-modules jdk.incubator.vector
```

In Apache NetBeans, set it under:

```text
Project -> Properties -> Run -> VM Options
```

## Machine Learning Workflow

```text
load data
-> inspect
-> shuffle and split
-> scale features
-> build
-> train
-> evaluate
-> save
-> predict
```

### 1. Load the one-hot encoded targets

```java
private static final int NUM_INPUTS = 4;
private static final int NUM_OUTPUTS = 3;

TabularDataSet<MLDataItem> dataSet =
        DataSets.readCsv(DATASET_PATH, NUM_INPUTS, NUM_OUTPUTS, true, ",");
```

The three output columns distinguish this example from the binary spam classifier, which uses only one output.

### 2. Shuffle and split

```java
dataSet.shuffle(42);
TrainTestSplit split = dataSet.trainTestSplit(0.8);
```

The fixed seed makes the shuffle reproducible. The model trains on 80% of the samples and is evaluated on the remaining 20%.

### 3. Scale without data leakage

```java
MinMaxScaler scaler = DataSets.scaleToMinMax(trainingSet);
scaler.apply(testSet);
```

The scaler learns its parameters from the training set only. The same transformation is then applied to the unseen test set.

### 4. Build a multiclass network

```java
FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
        .addInputLayer(4)
        .addFullyConnectedLayer(16, ActivationType.TANH)
        .addOutputLayer(3, ActivationType.SOFTMAX)
        .lossFunction(LossType.CROSS_ENTROPY)
        .randomSeed(42)
        .build();
```

`SOFTMAX` converts the three output scores into class probabilities that sum to approximately one. Cross-entropy measures the difference between those probabilities and the expected one-hot target.

### 5. Configure and train

```java
neuralNet.getTrainer()
        .setStopError(0.03f)
        .setStopEpochs(350)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.ADAM);

neuralNet.train(trainingSet);
```

The trainer stops when it reaches the target error or the maximum number of epochs. ADAM adapts the parameter updates during training, while full-batch mode keeps the configuration compact for this small 150-row dataset.

### 6. Evaluate and save

```java
ClassificationMetrics metrics =
        (ClassificationMetrics) neuralNet.test(testSet);

neuralNet.setNormalizer(scaler);
Files.createDirectories(Path.of("models"));
neuralNet.save(MODEL_PATH);
```

The test metrics describe performance on unseen flowers. Attaching the scaler to the model keeps training-time preprocessing available for future predictions.

### 7. Predict a species

```java
float[] flower = {5.1f, 3.5f, 1.4f, 0.2f};
float[] probabilities = neuralNet.predict(flower);
int predictedClass = indexOfLargest(probabilities);
```

The helper selects the index with the largest probability and maps it to `SETOSA`, `VERSICOLOR`, or `VIRGINICA`.

## Run the Example

From this project directory:

```bash
mvn compile
MAVEN_OPTS="--add-modules jdk.incubator.vector" mvn exec:java
```

The program prints dataset information, training progress, classification metrics, the three predicted probabilities, and the predicted species.

## Expected Output Shape

Exact values can vary, but the final lines have this form:

```text
Class probabilities: [0.98, 0.02, 0.00]
Predicted species: SETOSA
```
