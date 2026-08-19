# Sorting Execution Time - Simple Linear Regression with Deep Netts

This example demonstrates a complete **simple linear regression workflow** using Deep Netts.

The goal is to estimate sorting execution time from one numerical feature: the number of comparisons performed by the sorting algorithm.

```text
comparison_count -> model -> execution_time_ms
```

It follows the same project structure and Machine Learning workflow as the [Multiple Linear Regression](../multiple-linear-regression/) example. The important difference is that this model receives exactly one input feature.

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
linear-regression/
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

## Prerequisites

- Java 25
- Maven
- Deep Netts `4.0.0`
- a configured Deep Netts license

Deep Netts 4 uses the incubating Java Vector API. Enable it when running from a terminal:

```bash
MAVEN_OPTS="--add-modules jdk.incubator.vector" mvn clean compile exec:java
```

## Build and run

From this project directory:

```bash
cd examples/regression/linear-regression
MAVEN_OPTS="--add-modules jdk.incubator.vector" mvn clean compile exec:java
```

The program explicitly selects CPU execution:

```java
DeepNetts.getInstance().setUseCuda(false);
```

The dataset and model are small, so CUDA is unnecessary for this introductory example.

# Machine Learning Workflow

The example intentionally mirrors the multiple-regression project:

```text
Load data
    |
    v
Inspect data
    |
    v
Shuffle
    |
    v
Train/Test split
    |
    v
Standardize feature
    |
    v
Build 1 -> 1 model
    |
    v
Configure training
    |
    v
Train
    |
    v
Evaluate
    |
    v
Save
    |
    v
Predict
```

## 1. Runtime configuration

CUDA is disabled before data loading or model creation:

```java
DeepNetts.getInstance().setUseCuda(false);
```

Keeping runtime configuration explicit makes execution reproducible and avoids requiring a GPU setup.

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

If the problem requires more than one input feature, use the [Multiple Linear Regression](../multiple-linear-regression/) project as the starting template instead.

## Summary

This example provides the same complete workflow as the multiple-regression project while keeping the model itself minimal:

```text
one feature -> one linear output -> one continuous prediction
```

It is intended as the first regression example to read before moving to multiple input features.
