<a class="github-example-button" href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/classification/logistic-regression"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.64 0 8.13c0 3.59 2.29 6.64 5.47 7.71.4.08.55-.18.55-.39 0-.19-.01-.83-.01-1.51-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.21-3.64-.9-3.64-4.01 0-.89.31-1.62.82-2.19-.08-.21-.36-1.04.08-2.16 0 0 .67-.22 2.2.84A7.5 7.5 0 0 1 8 3.92a7.5 7.5 0 0 1 2 .27c1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.95.08 2.16.51.57.82 1.3.82 2.19 0 3.12-1.87 3.8-3.65 4.01.29.25.54.74.54 1.5 0 1.08-.01 1.95-.01 2.22 0 .21.15.47.55.39A8.16 8.16 0 0 0 16 8.13C16 3.64 12.42 0 8 0Z"></path></svg><span>View Example on GitHub</span></a>

# Logistic Regression

This walkthrough builds the Sonar Logistic Regression example one part at a time. It demonstrates binary classification with the smallest possible neural-network architecture: inputs connected directly to one Sigmoid output.

**Problem:** Classify a sonar signal as a `ROCK` or a `MINE`.

**Dataset:** 208 sonar observations with 60 numerical signal features and one binary target.

**You will learn:** How logistic regression fits into the Deep Netts API, how to prevent data leakage during scaling, how to evaluate a binary classifier, save it, and use it for prediction.

## At a glance

| | |
|---|---|
| **ML task** | Binary classification |
| **Level** | Beginner |
| **Dataset** | 208 sonar observations |
| **Inputs** | 60 numerical sonar-signal features |
| **Target** | `0` for rock, `1` for mine |
| **Model** | `60 -> 1` logistic-regression network with a Sigmoid output |
| **Related concepts** | [Machine Learning Basics](../../lectures/01-ml-basics.md), [Neural Networks](../../lectures/02-neural-networks.md), [Deep Netts API](../../lectures/03-deep-netts-api.md), [Model Development](../../lectures/04-model-development.md) |

[Back to Classification examples](index.md)

The complete flow is:

```text
load -> inspect -> split -> scale -> build -> train -> evaluate -> save -> predict
```

## 1. Define the program configuration

Set the dataset path, model path, and expected data shape:

```java
private static final String DATASET_PATH =
        "src/main/resources/datasets/sonar.csv";

private static final String MODEL_PATH =
        "models/logistic-regression.dnet";

private static final int NUM_INPUTS = 60;
private static final int NUM_OUTPUTS = 1;
```

Every CSV row contains 60 input values followed by one binary target.

## 2. Select CPU execution

Disable CUDA before creating the model:

```java
DeepNetts.getInstance().setUseCuda(false);
```

This compact dataset and model run quickly on a CPU and do not require GPU configuration.

## 3. Load the Sonar dataset

Read the numerical CSV file:

```java
TabularDataSet<MLDataItem> dataSet =
        DataSets.readCsv(
                DATASET_PATH,
                NUM_INPUTS,
                NUM_OUTPUTS,
                false,
                ","
        );
```

The file has no header, so the fourth argument is `false`. Setting it to `true` would incorrectly discard the first observation as column names.

## 4. Inspect the data

Confirm that all observations were loaded:

```java
System.out.println("Samples: " + dataSet.size());
```

The expected result is `208`. This small check catches missing files and incorrect CSV-header configuration early.

## 5. Shuffle and split the observations

Shuffle reproducibly and reserve 20% of the data for testing:

```java
dataSet.shuffle(42);

TrainTestSplit split = dataSet.trainTestSplit(0.8);

DataSet<MLDataItem> trainingSet = split.getTrainingSet();
DataSet<MLDataItem> testSet = split.getTestSet();
```

The model learns only from the training set. The test set estimates how well it handles sonar observations that did not update its weights.

## 6. Scale the input features

Fit Min-Max scaling on the training set and apply the same transformation to the test set:

```java
MinMaxScaler scaler = DataSets.scaleToMinMax(trainingSet);

scaler.apply(testSet);
```

Fitting the scaler only on training data prevents information from the test set leaking into model development.

## 7. Build logistic regression

Create a network with no hidden layers:

```java
FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
        .addInputLayer(NUM_INPUTS)
        .addOutputLayer(NUM_OUTPUTS, ActivationType.SIGMOID)
        .lossFunction(LossType.CROSS_ENTROPY)
        .randomSeed(42)
        .build();
```

The architecture is:

```text
60 numerical features -> 1 Sigmoid output
```

With no hidden layer, the network is logistic regression rather than a multilayer neural network. The Sigmoid output represents the estimated probability of the positive class.

## 8. Configure and train

Set the training parameters and fit the model:

```java
neuralNet.getTrainer()
        .setStopEpochs(200)
        .setLearningRate(0.01f)
        .setOptimizer(OptimizerType.SGD)
        .setShuffle(true);

neuralNet.train(trainingSet);
```

SGD updates the output weights and bias to reduce Cross-Entropy loss. The fixed model and data seeds make repeated runs easier to compare.

## 9. Evaluate the classifier

Evaluate predictions on the held-out test set:

```java
ClassificationMetrics metrics =
        (ClassificationMetrics) neuralNet.test(testSet);

System.out.println(metrics);
```

Accuracy summarizes all correct decisions. Precision, recall, F1 score, specificity, false-positive rate, and false-negative rate reveal which errors the classifier makes.

## 10. Save the trained model

Create the output directory and serialize the model:

```java
Files.createDirectories(Path.of("models"));
FileIO.writeToFile(neuralNet, MODEL_PATH);
```

The example saves `models/logistic-regression.dnet`. Loading is intentionally not demonstrated while the Deep Netts 4 beta runtime is still finalizing model deserialization.

## 11. Select an example from the test set

Use a real, already-preprocessed observation rather than a hard-coded 60-value array:

```java
MLDataItem sonarExample = testSet.get(0);
float[] sonarSignal = sonarExample.getInput().getValues();
float actualTarget = sonarExample.getTargetOutput().getValues()[0];
```

The known target is retained only so the displayed prediction can be compared with the expected class.

## 12. Predict probability and class

Use the trained model instance:

```java
float mineProbability = neuralNet.predict(sonarSignal)[0];

System.out.printf("Mine probability: %.4f%n", mineProbability);
System.out.println("Predicted: "
        + (mineProbability >= 0.5f ? "MINE" : "ROCK"));
System.out.println("Actual: "
        + (actualTarget >= 0.5f ? "MINE" : "ROCK"));
```

The Sigmoid output is converted into a class using a `0.5` decision threshold.

## Logistic regression or a neural network?

Deep Netts represents both models with `FeedForwardNetwork`. Their architectures distinguish them:

| Model | Architecture | Capacity |
|---|---|---|
| Logistic Regression | `60 -> 1` | Learns a linear decision boundary |
| Spam Classification network | `5 -> 32 -> 16 -> 1` | Learns non-linear feature combinations |

Logistic regression is a useful baseline: it is compact, fast, and easy to interpret before trying a model with hidden layers.

## What you built

```text
Sonar CSV with 208 observations
        |
        v
80/20 train/test split
        |
        v
Min-Max scaling
        |
        v
60 -> 1 logistic-regression model
        |
        v
Training and classification evaluation
        |
        v
Saved model and test-sample prediction
```

## Run the complete project

The complete Java class, Sonar dataset, `pom.xml`, and README are available here:

<div class="github-action-right">

<a class="github-example-button" href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/classification/logistic-regression"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.64 0 8.13c0 3.59 2.29 6.64 5.47 7.71.4.08.55-.18.55-.39 0-.19-.01-.83-.01-1.51-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.21-3.64-.9-3.64-4.01 0-.89.31-1.62.82-2.19-.08-.21-.36-1.04.08-2.16 0 0 .67-.22 2.2.84A7.5 7.5 0 0 1 8 3.92a7.5 7.5 0 0 1 2 .27c1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.95.08 2.16.51.57.82 1.3.82 2.19 0 3.12-1.87 3.8-3.65 4.01.29.25.54.74.54 1.5 0 1.08-.01 1.95-.01 2.22 0 .21.15.47.55.39A8.16 8.16 0 0 0 16 8.13C16 3.64 12.42 0 8 0Z"></path></svg><span>View Example on GitHub</span></a>

</div>

<a class="back-button" href="../">← Back to Classification Examples</a>
