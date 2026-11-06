# Iris Multiclass Classification with Deep Netts

This example demonstrates a complete **multiclass classification workflow** using Deep Netts.

The model uses four flower measurements to classify an Iris flower as one of three species. Its structure intentionally follows the email-spam-detection example so that the differences between binary and multiclass classification are easy to compare.

## Run this example

**Requirements:** Java 25 or newer, Maven, and Git. If you are not sure they are installed, follow [Check your environment](../../../README.md#1-check-your-environment) first.

Maven downloads Deep Netts Community Edition (`com.deepnetts:deepnetts-core:4.0.5`) from Maven Central on the first build. No separate installation or extra JVM option is needed.

**1. Open the example folder.** From the `cookbook-examples` folder (the repository root), run:

```bash
cd examples/classification/iris-flower-classification
```

**2. Build and run the example:**

```bash
mvn clean compile exec:java
```

**3. Check the result.** The run takes about 5 seconds. Its last lines look like this:

```text
Samples: 150
Columns: [sepal_length, sepal_width, petal_length, petal_width, setosa, versicolor, virginica]
...
Class probabilities: [0.99999917, 8.8696953E-7, 1.34597316E-17]
Predicted species: SETOSA
```

Training progress and metrics are printed in between. The exact numbers can differ slightly between computers. On systems that use a decimal comma (for example Serbian or German Windows), numbers are printed as `0,9978` instead of `0.9978`.

**Generated files:** `models/iris-multiclass-classifier.dnet`. Running the example again overwrites the generated files. The `models/` and `target/` folders are ignored by Git.

Go back to the repository root when you are done:

```bash
cd ../../..
```

### If something goes wrong

- **`'mvn' is not recognized` or `mvn: command not found`** - Maven is not installed or not on the `PATH`. Follow [Maven](../../../README.md#maven), open a new terminal, and run `mvn --version` again.
- **`release version 25 not supported` or `Java 25 or newer is required`** - Maven runs on an older Java. Install JDK 25 and point `JAVA_HOME` to it, as described in [Java 25 or newer](../../../README.md#java-25-or-newer).
- **`Could not resolve dependencies` or `Could not transfer artifact com.deepnetts:deepnetts-core`** - Maven cannot reach Maven Central. Check the internet connection and any proxy or mirror in `~/.m2/settings.xml`, then force Maven to try again:

```bash
mvn -U clean compile exec:java
```
- **`NoSuchFileException` or `FileNotFoundException` for `src/main/resources/datasets/...`** - the command was not started from the example folder. Go back to the repository root, run the `cd` command from step 1, and run the example again.
- `WARNING: A terminally deprecated method in sun.misc.Unsafe has been called` at the start of a Maven command is printed by Maven itself on Java 24 and newer. It is harmless; ignore it.

More fixes are listed in [Troubleshooting](../../../README.md#troubleshooting).

### Run it in Apache NetBeans

1. Choose **File -> Open Project** and select the `examples/classification/iris-flower-classification` folder.
2. Click **Run Project** (F6). NetBeans uses the project folder as the working directory, so the dataset paths work without changes.

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
iris-flower-classification/
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

The trainer stops when it reaches the target error or the maximum number of epochs. ADAM adapts the parameter updates during training on this small 150-row dataset.

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
float[] flower = {
    5.1f,
    3.5f,
    1.4f,
    0.2f
};

float[] probabilities = neuralNet.predict(flower);
int predictedClass = indexOfLargest(probabilities);
```

The helper selects the index with the largest probability and maps it to `SETOSA`, `VERSICOLOR`, or `VIRGINICA`.
