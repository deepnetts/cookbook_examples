# Sorting Execution Time - Simple Linear Regression with Deep Netts

This example demonstrates a complete **simple linear regression workflow** using Deep Netts.

The goal is to estimate sorting execution time from one numerical feature: the number of comparisons performed by the sorting algorithm.

```text
comparison_count -> model -> execution_time_ms
```

It follows the same project structure and Machine Learning workflow as the [Multiple Linear Regression](../computer-hardware-performance-prediction/) example. The important difference is that this model receives exactly one input feature.

## Run this example

**Requirements:** Java 25 or newer, Maven, and Git. If you are not sure they are installed, follow [Check your environment](../../../README.md#1-check-your-environment) first.

Maven downloads Deep Netts Community Edition (`com.deepnetts:deepnetts-core:4.0.5`) from Maven Central on the first build. No separate installation or extra JVM option is needed.

**1. Open the example folder.** From the `cookbook-examples` folder (the repository root), run:

```bash
cd examples/regression/sorting-execution-time-prediction
```

**2. Build and run the example:**

```bash
mvn clean compile exec:java
```

**3. Check the result.** The run takes about 10 seconds. Its last lines look like this:

```text
Samples: 903
Columns: [comparison_count, execution_time_ms]
...
Predicted execution time for 100000 comparisons: 337.74 ms
```

Training progress and metrics are printed in between. The exact numbers can differ slightly between computers. On systems that use a decimal comma (for example Serbian or German Windows), numbers are printed as `0,9978` instead of `0.9978`.

**Generated files:** `models/sorting-execution-time-regression.dnet`, `target/datasets/sorting_algorithm_regression.csv` (the two columns selected with DFLib). Running the example again overwrites the generated files. The `models/` and `target/` folders are ignored by Git.

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

1. Choose **File -> Open Project** and select the `examples/regression/sorting-execution-time-prediction` folder.
2. Click **Run Project** (F6). NetBeans uses the project folder as the working directory, so the dataset paths work without changes.

## What this example demonstrates

- loading a prepared CSV dataset,
- inspecting its structure,
- reproducible shuffling,
- creating training and test sets,
- fitting preprocessing on training data only,
- building a `1 -> 1` linear model,
- configuring and training the model,
- evaluating on unseen data,
- saving the model with its preprocessing,
- predicting execution time for a new comparison count.

## Simple versus multiple linear regression

Simple linear regression uses one input feature:

```text
y = weight * x + bias
```

In this project:

```text
x = comparison_count
y = execution_time_ms
```

The companion computer-hardware project is multiple linear regression because it uses six input features to predict one target.

## Dataset

The provided raw benchmark data is stored at:

```text
src/main/resources/datasets/Sorting_Algorithm.csv
```

It contains measurements for several sorting algorithms:

```text
run, algorithm, array_size, execution_time_ms, memory_usage_kb, comparison_count
```

The `array_size` column is constant in the supplied data, so it cannot explain differences in execution time. For a meaningful one-feature example, this project uses `comparison_count`, which has a strong positive relationship with `execution_time_ms` in the supplied measurements.

At runtime, DFLib selects the two model columns in the required order:

```java
DataFrame regressionData = Csv.load(RAW_DATASET_PATH)
        .cols("comparison_count", "execution_time_ms")
        .select();
```

DFLib writes the selected view under Maven's generated `target/` directory. Deep Netts then reads this model-ready CSV:

```text
target/datasets/sorting_algorithm_regression.csv
```

The first selected column is the input feature and the second is the continuous target. The generated view is not committed and can always be recreated from the original dataset.

> This is an educational benchmark dataset. Results describe the supplied measurements and should not be treated as universal performance guarantees for sorting algorithms or hardware.

## Project structure

```text
sorting-execution-time-prediction/
├── pom.xml
├── README.md
├── models/
│   └── sorting-execution-time-regression.dnet
└── src/
    └── main/
        ├── java/
        │   └── com/deepnetts/examples/linearregression/
        │       └── LinearRegressionDeepNetts.java
        └── resources/
            └── datasets/
                └── Sorting_Algorithm.csv
```

The `models/` and `target/` directories are generated when the program runs.

## 1. Runtime configuration

CPU execution is selected before data loading or model creation:

```java
DeepNetts.getInstance().setUseCuda(false);
```

Community Edition runs on the CPU. Keeping the runtime configuration explicit shows where it is set before any data is loaded.

## 2. Load data

The prepared CSV has one input and one output:

```java
TabularDataSet<MLDataItem> dataSet =
        DataSets.readCsv(DATASET_PATH, NUM_INPUTS, NUM_OUTPUTS, true, ",");
```

`NUM_INPUTS` and `NUM_OUTPUTS` are both `1`.

## 3. Inspect data

The program prints the sample count and column names:

```java
System.out.println("Samples: " + dataSet.size());
System.out.println("Columns: " + Arrays.toString(dataSet.getColumnNames()));
```

This confirms that the expected file and two-column schema were loaded.

## 4. Shuffle and split

The dataset is shuffled with a fixed seed and split into training and test subsets:

```java
dataSet.shuffle(42);

TrainTestSplit split = dataSet.trainTestSplit(0.8);

DataSet<MLDataItem> trainingSet = split.getTrainingSet();
DataSet<MLDataItem> testSet = split.getTestSet();
```

The model learns from 80% of the samples. The remaining 20% stays unseen until evaluation.

## 5. Preprocess without data leakage

The standardizer is fitted using only the training set:

```java
Standardizer standardizer = new Standardizer(trainingSet);

standardizer.apply(trainingSet);
standardizer.apply(testSet);
```

Fitting preprocessing before the split would leak information from the test set into training. The same fitted transformation must be applied to future input.

## 6. Build the linear model

The network contains one input and one linear output, with no hidden layer:

```java
FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
        .addInputLayer(NUM_INPUTS)
        .addOutputLayer(NUM_OUTPUTS, ActivationType.LINEAR)
        .lossFunction(LossType.MEAN_SQUARED_ERROR)
        .randomSeed(42)
        .build();
```

Without a hidden layer, the model learns a straight-line relationship. Linear activation allows unrestricted continuous predictions, while Mean Squared Error measures regression error during training.

## 7. Configure and train

```java
neuralNet.getTrainer()
        .setStopEpochs(3000)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.SGD)
        .setShuffle(true);

neuralNet.train(trainingSet);
```

The fixed dataset and network seeds make repeated experiments easier to compare.

## 8. Evaluate

Evaluation uses the reserved test set, not the training set:

```java
RegressionMetrics metrics = (RegressionMetrics) neuralNet.test(testSet);
System.out.println(metrics);
```

Regression metrics describe the difference between predicted and measured execution times on unseen samples.

## 9. Save model with preprocessing

```java
neuralNet.setNormalizer(standardizer);

Files.createDirectories(Path.of("models"));
neuralNet.save(MODEL_PATH);
```

The model was trained with standardized input, so saving the fitted standardizer with the network keeps the prediction pipeline consistent.

## 10. Predict

```java
float comparisonCount = 100_000;
float predictedExecutionTime = neuralNet.predict(comparisonCount)[0];
```

The result is the estimated execution time in milliseconds for the supplied comparison count.

## Adapting the example

To reuse this project for another simple regression problem:

1. Replace the CSV with one numerical feature followed by one continuous target.
2. Keep `NUM_INPUTS = 1` and `NUM_OUTPUTS = 1`.
3. Update the dataset and model paths.
4. Decide whether standardization fits the new data.
5. Adjust training hyperparameters only after evaluating a baseline.
6. Preserve the same feature meaning and units during prediction.

If the problem requires more than one input feature, use the [Multiple Linear Regression](../computer-hardware-performance-prediction/) project as the starting template instead.

## Summary

This example provides the same complete workflow as the multiple-regression project while keeping the model itself minimal:

```text
one feature -> one linear output -> one continuous prediction
```

It is intended as the first regression example to read before moving to multiple input features.
