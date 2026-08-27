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
| **Default training** | Up to 350 CPU epochs, with an error-based stop condition |
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

## 0. Define the configuration

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

### Map the class order

Define names in the same order as the target columns:

```java
private static final String[] CLASS_NAMES = {
    "SETOSA", "VERSICOLOR", "VIRGINICA"
};
```

Index `0` maps to Setosa, index `1` to Versicolor, and index `2` to Virginica. This order must stay aligned with the CSV header.

## 1. Configure the runtime

Verify Java and select deterministic CPU execution:

```java
verifyJavaRuntime();
DeepNetts.getInstance().setUseCuda(false);
DeepNetts.getInstance().setMaxThreads(1);
```

<pre class="console-output">WARNING: Using incubator modules: jdk.incubator.vector</pre>

The example requires Java 25 with the Vector API enabled. CPU execution keeps
the project easy to run without CUDA, and one worker thread makes results easier
to reproduce.

## 2. Load the flowers

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

## 3. Inspect the dataset

Print the number of samples and parsed column names:

```java
System.out.println("Samples: " + dataSet.size());
System.out.println(
        "Columns: " + Arrays.toString(dataSet.getColumnNames())
);
```

<pre class="console-output">Samples: 150
Columns: [sepal_length, sepal_width, petal_length, petal_width, setosa, versicolor, virginica]</pre>

The expected result is 150 samples and seven columns: four inputs followed by three targets.

## 4. Shuffle and split

Shuffle reproducibly, then reserve test samples:

```java
dataSet.shuffle(42);

TrainTestSplit split = dataSet.trainTestSplit(0.8);

DataSet<MLDataItem> trainingSet = split.getTrainingSet();
DataSet<MLDataItem> testSet = split.getTestSet();
```

The network learns only from the training set. The test set measures how it handles unseen flowers.

## 5. Scale the measurements

Fit Min-Max scaling on training data and reuse it for testing:

```java
MinMaxScaler scaler = DataSets.scaleToMinMax(trainingSet);
scaler.apply(testSet);
```

All four features are measured in centimeters but use different ranges. Fitting the scaler only on training data prevents data leakage.

## 6. Build a Softmax network

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

## 7. Configure and train

Configure the trainer and start learning:

```java
neuralNet.getTrainer()
        .setStopError(0.03f)
        .setStopEpochs(350)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.ADAM);

neuralNet.train(trainingSet);
```

<pre class="console-output">TRAINING NEURAL NETWORK
------------------------------------------------------------------------

Initial Train Error:1.0736417
Epoch:1, Time:10ms, TrainError:1.0048019, TrainErrorChange:-0.06883979, TrainAccuracy:0.41945544
Epoch:2, Time:3ms, TrainError:0.9104093, TrainErrorChange:-0.0943926, TrainAccuracy:0.53105694
Epoch:3, Time:2ms, TrainError:0.8589118, TrainErrorChange:-0.05149746, TrainAccuracy:0.54152936
...
Epoch:350, Time:1ms, TrainError:0.04522642, TrainErrorChange:-3.0234456E-5, TrainAccuracy:0.9670732

TRAINING COMPLETED
Total Training Time: 320ms
------------------------------------------------------------------------</pre>

ADAM adapts parameter updates during training. The middle epochs are omitted
for readability. This run reached the 350-epoch limit, reducing training error
from about 1.07 to 0.045 and reaching about 96.7% training accuracy.

## 8. Evaluate the model

Measure performance on the test set:

```java
ClassificationMetrics metrics = (ClassificationMetrics) neuralNet.test(testSet);
System.out.println(metrics);
```

<pre class="console-output">Class: Macro Average
Total items: 32
True positive:26.0 Number of examples correctly classified as positive
True negative:0.0 Number of examples correctly classified as negative
False positive:3.0 Number of examples incorrectly classified as positive
False negative:3.0 Number of examples incorrectly classified as negative
Accuracy (ACC): 0.8125 How often is a classifier correct in total (percent of correct classifications)
Precision (PPV): 0.8965517 How often is a classifier correct when it gives positive prediction
Recall: 0.8965517 When it is actually positive class, how often does it give positive prediction
F1 Score: 0.8965517 Harmonic average (balance) of precision and recall
Specificity (TNR): 0.0 When it is actually negative class, how often does it give negative prediction
Fall-out (FPR): 1.0 How often it gives false positive prediction in total (percent of false positive predictions)
False negative rate (FNR): 0.10344828 How often it gives false negative prediction in total (percent of false negative predictions)</pre>

These are macro-averaged multiclass metrics over 32 held-out flowers. Accuracy
shows the overall result, while precision, recall, F1, and the error counts
describe performance across the three classes.

## 9. Save model and scaler

Attach preprocessing before saving:

```java
neuralNet.setNormalizer(scaler);

Files.createDirectories(Path.of("models"));
neuralNet.save(MODEL_PATH);
```

The saved model retains the same scaling required for future raw flower measurements.

## 10. Use the trained model

Describe a new flower, run inference, and select the largest Softmax
probability:

```java
float[] flower = {
    5.1f,
    3.5f,
    1.4f,
    0.2f
};

float[] probabilities = neuralNet.predict(flower);
int predictedClass = indexOfLargest(probabilities);

System.out.println("Class probabilities: " + Arrays.toString(probabilities));
System.out.println("Predicted species: " + CLASS_NAMES[predictedClass]);
```

<pre class="console-output">Class probabilities: [0.99999917, 8.8696953E-7, 1.34597316E-17]
Predicted species: SETOSA</pre>

The values follow the `CLASS_NAMES` order. `indexOfLargest` performs
`argmax`, selecting the first probability and producing `SETOSA`.

## Run in NetBeans

Add this under **Project Properties → Run → VM Options**:

```text
--add-modules=jdk.incubator.vector
```

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
