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
| **Default training** | 100 CPU epochs |
| **Related concepts** | [Machine Learning Basics](../../lectures/01-ml-basics.md), [Neural Networks](../../lectures/02-neural-networks.md), [Backpropagation](../../lectures/05-backpropagation.md), [Deep Netts API](../../lectures/03-deep-netts-api.md), [Model Development](../../lectures/04-model-development.md) |

## 1. Configure the runtime

```java
verifyJavaRuntime();
DeepNetts.getInstance().setUseCuda(false);
DeepNetts.getInstance().setMaxThreads(1);
```

**Output:**

<pre class="console-output">WARNING: Using incubator modules: jdk.incubator.vector</pre>

The example requires Java 25 with the Vector API enabled. It selects CPU
execution and limits Deep Netts to one worker thread for reproducible results.

## 2. Load and inspect transactions

```java
TabularDataSet<MLDataItem> dataSet = DataSets.readCsv(
        DATASET_PATH, NUM_INPUTS, NUM_OUTPUTS, true, ",");

System.out.println("Samples: " + dataSet.size());
System.out.println("Columns: " + Arrays.toString(dataSet.getColumnNames()));
float[] exampleTransaction = dataSet.get(0).getInput().getValues().clone();
```

**Output:**

<pre class="console-output">Samples: 999
Columns: [V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15, V16, V17, V18, V19, V20, V21, V22, V23, V24, V25, V26, V27, V28, Amount, Class]</pre>

The balanced subset makes the learning flow practical while retaining both
fraud and legitimate transactions. One transaction is copied before scaling
and reused for the final prediction.

## 3. Create held-out data

```java
dataSet.shuffle(42);
TrainTestSplit split = dataSet.trainTestSplit(0.8);
DataSet<MLDataItem> trainingSet = split.getTrainingSet();
DataSet<MLDataItem> testSet = split.getTestSet();
```

The fixed seed makes the 80/20 split reproducible.

## 4. Scale without data leakage

```java
MinMaxScaler scaler = DataSets.scaleToMinMax(trainingSet);
scaler.apply(testSet);
```

Only the training set determines scaling parameters. The test set remains unseen evidence for evaluation.

## 5. Build the fraud detector

```java
FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
        .addInputLayer(NUM_INPUTS)
        .addFullyConnectedLayer(32)
        .addFullyConnectedLayer(16)
        .addOutputLayer(NUM_OUTPUTS, ActivationType.SIGMOID)
        .lossFunction(LossType.CROSS_ENTROPY)
        .randomSeed(42)
        .build();
```

The Sigmoid output represents fraud probability. Cross-Entropy is the matching
loss function for this binary-classification task.

## 6. Configure and train

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

**Output:**

<pre class="console-output">TRAINING NEURAL NETWORK
------------------------------------------------------------------------

Initial Train Error:0.7627354
Epoch:1, Time:67ms, TrainError:0.71978647, TrainErrorChange:-0.04294896, TrainAccuracy:0.55569464
Epoch:2, Time:15ms, TrainError:0.6540446, TrainErrorChange:-0.06574184, TrainAccuracy:0.7772215
Epoch:3, Time:9ms, TrainError:0.60179204, TrainErrorChange:-0.05225259, TrainAccuracy:0.8698373
...
Epoch:100, Time:7ms, TrainError:0.1131876, TrainErrorChange:-7.3803216E-4, TrainAccuracy:0.9586984

TRAINING COMPLETED
Total Training Time: 947ms
------------------------------------------------------------------------</pre>

The middle epochs are omitted for readability. Across all 100 epochs, training
error fell from about 0.76 to 0.11 and training accuracy reached about 95.9%.

## 7. Evaluate the classifier

```java
ClassificationMetrics metrics =
        (ClassificationMetrics) neuralNet.test(testSet);
System.out.println(metrics);
```

**Output:**

<pre class="console-output">Class: Class
Total items: 199
True positive:91.0 Number of examples correctly classified as positive
True negative:99.0 Number of examples correctly classified as negative
False positive:2.0 Number of examples incorrectly classified as positive
False negative:7.0 Number of examples incorrectly classified as negative
Accuracy (ACC): 0.95477384 How often is a classifier correct in total (percent of correct classifications)
Precision (PPV): 0.97849464 How often is a classifier correct when it gives positive prediction
Recall: 0.9285714 When it is actually positive class, how often does it give positive prediction
F1 Score: 0.95287955 Harmonic average (balance) of precision and recall
Specificity (TNR): 0.980198 When it is actually negative class, how often does it give negative prediction
Fall-out (FPR): 0.01980198 How often it gives false positive prediction in total (percent of false positive predictions)
False negative rate (FNR): 0.071428575 How often it gives false negative prediction in total (percent of false negative predictions)</pre>

For fraud detection, inspect precision and recall together rather than relying
only on accuracy. This run produced two false alarms and missed seven fraudulent
transactions in the 199-item test set.

## 8. Save the model

```java
neuralNet.setNormalizer(scaler);
Files.createDirectories(Path.of("models"));
neuralNet.save(MODEL_PATH);
```

Saving the fitted scaler with the network preserves the preprocessing needed
for later predictions.

## 9. Predict fraud probability

```java
float fraudProbability = neuralNet.predict(exampleTransaction)[0];
System.out.printf("Fraud probability: %.4f%n", fraudProbability);
System.out.println(fraudProbability >= 0.5f ? "FRAUD" : "LEGITIMATE");
```

**Output:**

<pre class="console-output">Fraud probability: 0.9978
FRAUD</pre>

The probability is above the `0.5` threshold, so the transaction is classified
as fraud.

## Run the example

Pass this option to the Java process through your IDE's application run configuration or the command line:

```text
--add-modules=jdk.incubator.vector
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
