<a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/classification/iris-flower-classification">View Example on GitHub</a>

# Iris Flower Classification

This walkthrough builds an Iris flower classifier one part at a time. It demonstrates multiclass classification: predicting one class from three or more possible categories.

**Problem:** Identify an Iris flower as Setosa, Versicolor, or Virginica from four measurements.

**Dataset:** 150 flowers with four numerical features and three one-hot encoded target columns.

## At a glance

| | |
|---|---|
| **ML task** | Multiclass classification |
| **Level** | Beginner |
| **Dataset** | 150 Iris flower records |
| **Inputs** | Four numerical flower measurements |
| **Target** | One of three Iris species, represented by one-hot columns |
| **Model** | `4 -> 16 -> 3` feed-forward neural network with a Softmax output |
| **Related concepts** | [Machine Learning Basics](../../lectures/01-ml-basics.md), [Neural Networks](../../lectures/02-neural-networks.md), [Model Development](../../lectures/04-model-development.md) |

The model receives four flower measurements:

```text
sepal_length, sepal_width, petal_length, petal_width
```

and predicts one of three species:

```text
SETOSA, VERSICOLOR, VIRGINICA
```

The complete flow is:

```text
load -> inspect -> split -> scale -> build -> train -> evaluate -> save -> predict
```

## 1. Define the configuration

Set the dataset path, model path, and expected shape:

```java
private static final String DATASET_PATH =
        "src/main/resources/datasets/iris-flowers.csv";

private static final String MODEL_PATH =
        "models/iris-multiclass-classifier.dnet";

private static final int NUM_INPUTS = 4;
private static final int NUM_OUTPUTS = 3;
```

Four inputs describe a flower. Three outputs represent the three possible species.

## 2. Map the class order

Define names in the same order as the target columns:

```java
private static final String[] CLASS_NAMES = {
    "SETOSA", "VERSICOLOR", "VIRGINICA"
};
```

Index `0` maps to Setosa, index `1` to Versicolor, and index `2` to Virginica. This order must stay aligned with the CSV header.

## 3. Select CPU execution

Disable CUDA for this small example:

```java
DeepNetts.getInstance().setUseCuda(false);
```

CPU execution keeps the project easy to run without a CUDA installation.

## 4. Load the flowers

Read four input columns and three output columns:

```java
TabularDataSet<MLDataItem> dataSet =
        DataSets.readCsv(
                DATASET_PATH,
                NUM_INPUTS,
                NUM_OUTPUTS,
                true,
                ","
        );
```

The three target columns are one-hot encoded. A Setosa row ends with `1,0,0`, while the other species activate a different target column.

## 5. Inspect the dataset

Print the number of samples and parsed column names:

```java
System.out.println("Samples: " + dataSet.size());
System.out.println(
        "Columns: " + Arrays.toString(dataSet.getColumnNames())
);
```

The expected result is 150 samples and seven columns: four inputs followed by three targets.

## 6. Shuffle and split

Shuffle reproducibly, then reserve test samples:

```java
dataSet.shuffle(42);

TrainTestSplit split = dataSet.trainTestSplit(0.8);

DataSet<MLDataItem> trainingSet = split.getTrainingSet();
DataSet<MLDataItem> testSet = split.getTestSet();
```

The network learns only from the training set. The test set measures how it handles unseen flowers.

## 7. Scale the measurements

Fit Min-Max scaling on training data and reuse it for testing:

```java
MinMaxScaler scaler = DataSets.scaleToMinMax(trainingSet);
scaler.apply(testSet);
```

All four features are measured in centimeters but use different ranges. Fitting the scaler only on training data prevents data leakage.

## 8. Build a Softmax network

Create the `4 -> 16 -> 3` architecture:

```java
FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
        .addInputLayer(NUM_INPUTS)
        .addFullyConnectedLayer(16, ActivationType.TANH)
        .addOutputLayer(NUM_OUTPUTS, ActivationType.SOFTMAX)
        .lossFunction(LossType.CROSS_ENTROPY)
        .randomSeed(42)
        .build();
```

The hidden layer learns non-linear relationships between flower measurements. Softmax produces three comparable probabilities, and Cross-Entropy trains them against the one-hot targets.

## 9. Train with ADAM

Configure the trainer and start learning:

```java
neuralNet.getTrainer()
        .setStopError(0.03f)
        .setStopEpochs(350)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.ADAM);

neuralNet.train(trainingSet);
```

ADAM adapts parameter updates during training. Training stops after reaching the target error or the maximum number of epochs.

## 10. Evaluate the model

Measure performance on the test set:

```java
ClassificationMetrics metrics =
        (ClassificationMetrics) neuralNet.test(testSet);

System.out.println(metrics);
```

Accuracy gives an overall result, while precision, recall, and F1 help describe classification errors.

## 11. Save model and scaler

Attach preprocessing before saving:

```java
neuralNet.setNormalizer(scaler);

Files.createDirectories(Path.of("models"));
neuralNet.save(MODEL_PATH);
```

The saved model retains the same scaling required for future raw flower measurements.

## 12. Predict probabilities

Describe a new flower and run inference:

```java
float[] flower = {
    5.1f,
    3.5f,
    1.4f,
    0.2f
};

float[] probabilities = neuralNet.predict(flower);
```

The result contains one probability for each class in `CLASS_NAMES` order.

## 13. Select the species

Find the position of the largest probability:

```java
int predictedClass = indexOfLargest(probabilities);

System.out.println(
        "Predicted species: " + CLASS_NAMES[predictedClass]
);
```

`indexOfLargest` is the `argmax` operation. It converts the probability vector into the final class label.

## What you built

You assembled a complete multiclass pipeline:

```text
One-hot Iris CSV
        |
        v
80/20 train/test split
        |
        v
Min-Max scaling
        |
        v
4 -> 16 -> 3 Softmax network
        |
        v
Classification evaluation
        |
        v
Saved model and species prediction
```

<div class="github-project-action">

<a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/classification/iris-flower-classification">View Example on GitHub</a>

</div>

<a class="back-button" href="../../">← Back to Examples</a>
