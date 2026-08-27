<a class="github-example-button" href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/classification/sonar-rock-mine-classification"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.64 0 8.13c0 3.59 2.29 6.64 5.47 7.71.4.08.55-.18.55-.39 0-.19-.01-.83-.01-1.51-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.21-3.64-.9-3.64-4.01 0-.89.31-1.62.82-2.19-.08-.21-.36-1.04.08-2.16 0 0 .67-.22 2.2.84A7.5 7.5 0 0 1 8 3.92a7.5 7.5 0 0 1 2 .27c1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.95.08 2.16.51.57.82 1.3.82 2.19 0 3.12-1.87 3.8-3.65 4.01.29.25.54.74.54 1.5 0 1.08-.01 1.95-.01 2.22 0 .21.15.47.55.39A8.16 8.16 0 0 0 16 8.13C16 3.64 12.42 0 8 0Z"></path></svg><span>View Example on GitHub</span></a>

# Sonar Rock or Mine Classification

This walkthrough builds a Sonar rock-or-mine classifier one part at a time. It uses logistic regression with the smallest possible neural-network architecture: inputs connected directly to one Sigmoid output.

**Problem:** Classify a sonar signal as a `ROCK` or a `MINE`.

**Dataset:** 208 sonar observations with 60 numerical signal features and one binary target.

## At a glance

| | |
|---|---|
| **ML task** | Binary classification |
| **Level** | Beginner |
| **Dataset** | 208 sonar observations |
| **Inputs** | 60 numerical sonar-signal features |
| **Target** | `0` for rock, `1` for mine |
| **Model** | `60 -> 1` sonar-rock-mine-classification network with a Sigmoid output |
| **Default training** | 200 CPU epochs |
| **Related concepts** | [Machine Learning Basics](../../lectures/01-ml-basics.md), [Neural Networks](../../lectures/02-neural-networks.md), [Backpropagation](../../lectures/05-backpropagation.md), [Deep Netts API](../../lectures/03-deep-netts-api.md), [Model Development](../../lectures/04-model-development.md) |

The complete flow is:

```text
load -> inspect -> split -> scale -> build -> train -> evaluate -> save -> predict
```

## 0. Define the program configuration

Set the dataset path, model path, and expected data shape:

```java
private static final String DATASET_PATH =
        "src/main/resources/datasets/sonar.csv";

private static final String MODEL_PATH =
        "models/sonar-rock-mine-classification.dnet";

private static final int NUM_INPUTS = 60;
private static final int NUM_OUTPUTS = 1;
```

Every CSV row contains 60 input values followed by one binary target.

## 1. Configure the runtime

Verify Java and disable CUDA before creating the model:

```java
verifyJavaRuntime();
DeepNetts.getInstance().setUseCuda(false);
```

**Output:**

<pre class="console-output">WARNING: Using incubator modules: jdk.incubator.vector</pre>

The example requires Java 25 with the Vector API enabled. This compact dataset
and model run quickly on a CPU and do not require GPU configuration.

## 2. Load the Sonar dataset

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

## 3. Inspect the data

Confirm that all observations were loaded:

```java
System.out.println("Samples: " + dataSet.size());
```

**Output:**

<pre class="console-output">Samples: 208</pre>

The expected result is `208`. This small check catches missing files and incorrect CSV-header configuration early.

## 4. Shuffle and split the observations

Shuffle reproducibly and reserve 20% of the data for testing:

```java
dataSet.shuffle(42);

TrainTestSplit split = dataSet.trainTestSplit(0.8);

DataSet<MLDataItem> trainingSet = split.getTrainingSet();
DataSet<MLDataItem> testSet = split.getTestSet();
```

The model learns only from the training set. The test set estimates how well it handles sonar observations that did not update its weights.

## 5. Scale the input features

Fit Min-Max scaling on the training set and apply the same transformation to the test set:

```java
MinMaxScaler scaler = DataSets.scaleToMinMax(trainingSet);

scaler.apply(testSet);
```

Fitting the scaler only on training data prevents information from the test set leaking into model development.

## 6. Build logistic regression

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

## 7. Configure and train

Set the training parameters and fit the model:

```java
neuralNet.getTrainer()
        .setStopEpochs(200)
        .setLearningRate(0.01f)
        .setOptimizer(OptimizerType.SGD)
        .setShuffle(true);

neuralNet.train(trainingSet);
```

**Output:**

<pre class="console-output">TRAINING NEURAL NETWORK
------------------------------------------------------------------------

Initial Train Error:0.69915146
Epoch:1, Time:8ms, TrainError:0.6907358, TrainErrorChange:-0.008415639, TrainAccuracy:0.5903614
Epoch:2, Time:2ms, TrainError:0.6626929, TrainErrorChange:-0.028042912, TrainAccuracy:0.62650603
Epoch:3, Time:2ms, TrainError:0.64100194, TrainErrorChange:-0.021690965, TrainAccuracy:0.6626506
...
Epoch:200, Time:1ms, TrainError:0.31379443, TrainErrorChange:-0.0015623271, TrainAccuracy:0.87349397

TRAINING COMPLETED
Total Training Time: 124ms
------------------------------------------------------------------------</pre>

SGD updates the output weights and bias to reduce Cross-Entropy loss. The
middle epochs are omitted for readability. Across all 200 epochs, training
error fell from about 0.70 to 0.31 and training accuracy reached about 87.3%.

## 8. Evaluate the classifier

Evaluate predictions on the held-out test set:

```java
ClassificationMetrics metrics = (ClassificationMetrics) neuralNet.test(testSet);
System.out.println(metrics);
```

**Output:**

<pre class="console-output">Class: out1
Total items: 41
True positive:15.0 Number of examples correctly classified as positive
True negative:15.0 Number of examples correctly classified as negative
False positive:2.0 Number of examples incorrectly classified as positive
False negative:9.0 Number of examples incorrectly classified as negative
Accuracy (ACC): 0.73170733 How often is a classifier correct in total (percent of correct classifications)
Precision (PPV): 0.88235295 How often is a classifier correct when it gives positive prediction
Recall: 0.625 When it is actually positive class, how often does it give positive prediction
F1 Score: 0.7317073 Harmonic average (balance) of precision and recall
Specificity (TNR): 0.88235295 When it is actually negative class, how often does it give negative prediction
Fall-out (FPR): 0.11764706 How often it gives false positive prediction in total (percent of false positive predictions)
False negative rate (FNR): 0.375 How often it gives false negative prediction in total (percent of false negative predictions)</pre>

The model correctly classified about 73.2% of the 41 held-out observations. Its
high precision but lower recall means mine predictions are usually correct,
while nine actual mines were missed.

## 9. Save the trained model

Create the output directory and serialize the model:

```java
Files.createDirectories(Path.of("models"));
FileIO.writeToFile(neuralNet, MODEL_PATH);
```

The example saves `models/sonar-rock-mine-classification.dnet`. Loading is intentionally not demonstrated while the Deep Netts 4 beta runtime is still finalizing model deserialization.

## 10. Use the trained model

Use a real, already-preprocessed test observation, predict its mine
probability, and compare the predicted and actual classes:

```java
MLDataItem sonarExample = testSet.get(0);
float[] sonarSignal = sonarExample.getInput().getValues();
float actualTarget = sonarExample.getTargetOutput().getValues()[0];
float mineProbability = neuralNet.predict(sonarSignal)[0];

System.out.printf("Mine probability: %.4f%n", mineProbability);
System.out.println("Predicted: "
        + (mineProbability >= 0.5f ? "MINE" : "ROCK"));
System.out.println("Actual: "
        + (actualTarget >= 0.5f ? "MINE" : "ROCK"));
```

**Output:**

<pre class="console-output">Mine probability: 0.8297
Predicted: MINE
Actual: MINE</pre>

The Sigmoid output is above the `0.5` threshold, so this held-out observation
is correctly classified as `MINE`.

## Run in NetBeans

Add this under **Project Properties → Run → VM Options**:

```text
--add-modules=jdk.incubator.vector
```

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
60 -> 1 sonar-rock-mine-classification model
        |
        v
Training and classification evaluation
        |
        v
Saved model and test-sample prediction
```

<div class="github-project-action">

<a class="github-example-button" href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/classification/sonar-rock-mine-classification"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.64 0 8.13c0 3.59 2.29 6.64 5.47 7.71.4.08.55-.18.55-.39 0-.19-.01-.83-.01-1.51-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.21-3.64-.9-3.64-4.01 0-.89.31-1.62.82-2.19-.08-.21-.36-1.04.08-2.16 0 0 .67-.22 2.2.84A7.5 7.5 0 0 1 8 3.92a7.5 7.5 0 0 1 2 .27c1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.95.08 2.16.51.57.82 1.3.82 2.19 0 3.12-1.87 3.8-3.65 4.01.29.25.54.74.54 1.5 0 1.08-.01 1.95-.01 2.22 0 .21.15.47.55.39A8.16 8.16 0 0 0 16 8.13C16 3.64 12.42 0 8 0Z"></path></svg><span>View Example on GitHub</span></a>

</div>

<a class="back-button" href="../">← Back to Classification Examples</a>
