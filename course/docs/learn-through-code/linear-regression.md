<a class="github-example-button" href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/linear-regression"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.64 0 8.13c0 3.59 2.29 6.64 5.47 7.71.4.08.55-.18.55-.39 0-.19-.01-.83-.01-1.51-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.21-3.64-.9-3.64-4.01 0-.89.31-1.62.82-2.19-.08-.21-.36-1.04.08-2.16 0 0 .67-.22 2.2.84A7.5 7.5 0 0 1 8 3.92a7.5 7.5 0 0 1 2 .27c1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.95.08 2.16.51.57.82 1.3.82 2.19 0 3.12-1.87 3.8-3.65 4.01.29.25.54.74.54 1.5 0 1.08-.01 1.95-.01 2.22 0 .21.15.47.55.39A8.16 8.16 0 0 0 16 8.13C16 3.64 12.42 0 8 0Z"></path></svg><span>View Example on GitHub</span></a>

# Build a Simple Linear Regression Program

In this walkthrough, you will build the Sorting Execution Time - Simple Linear Regression example one part at a time.

The model uses one numerical feature:

```text
comparison_count
```

and predicts one continuous target:

```text
execution_time_ms
```

The complete flow is:

```text
select columns -> load -> inspect -> split -> standardize -> build -> train -> evaluate -> save -> predict
```


## 1. Configure the program

Define the dataset and model paths, followed by the expected input and output sizes:

```java
private static final String RAW_DATASET_PATH =
        "src/main/resources/datasets/Sorting_Algorithm.csv";

private static final String DATASET_PATH =
        "target/datasets/sorting_algorithm_regression.csv";

private static final String MODEL_PATH =
        "models/sorting-execution-time-regression.dnet";

private static final int NUM_INPUTS = 1;
private static final int NUM_OUTPUTS = 1;
```

One input represents `comparison_count`. One output represents the predicted `execution_time_ms`.

## 2. Select CPU execution

Disable CUDA at the start of `main`:

```java
DeepNetts.getInstance().setUseCuda(false);
```

This introductory model and dataset are small enough to run efficiently on CPU.

## 3. Select the model columns

Use DFLib to select one feature and one target from the original CSV:

```java
DataFrame regressionData = Csv.load(RAW_DATASET_PATH)
        .cols("comparison_count", "execution_time_ms")
        .select();

Csv.saver()
        .createMissingDirs()
        .save(regressionData, DATASET_PATH);
```

The selection order defines the model contract. The generated file lives under `target/`, so only the original dataset is stored in the repository.

## 4. Load the dataset

Read the generated two-column CSV with Deep Netts:

```java
TabularDataSet<MLDataItem> dataSet =
        DataSets.readCsv(DATASET_PATH, NUM_INPUTS, NUM_OUTPUTS, true, ",");
```

Deep Netts interprets the first column as the input and the final column as the target.

## 5. Inspect the data

Confirm the number of samples and column order:

```java
System.out.println("Samples: " + dataSet.size());
System.out.println("Columns: " + Arrays.toString(dataSet.getColumnNames()));
```

The output should report 903 samples and the columns `comparison_count` and `execution_time_ms`.

## 6. Create train and test sets

Shuffle reproducibly, then reserve 20% of the samples for evaluation:

```java
dataSet.shuffle(42);

TrainTestSplit split = dataSet.trainTestSplit(0.8);

DataSet<MLDataItem> trainingSet = split.getTrainingSet();
DataSet<MLDataItem> testSet = split.getTestSet();
```

The model learns only from `trainingSet`. The fixed seed keeps repeated experiments comparable.

## 7. Standardize the feature

Fit preprocessing only on training data and apply the same transformation to both subsets:

```java
Standardizer standardizer = new Standardizer(trainingSet);

standardizer.apply(trainingSet);
standardizer.apply(testSet);
```

Keeping the test set out of the fitting step prevents data leakage.

## 8. Build a 1 to 1 model

Create a network with one input, no hidden layer, and one linear output:

```java
FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
        .addInputLayer(NUM_INPUTS)
        .addOutputLayer(NUM_OUTPUTS, ActivationType.LINEAR)
        .lossFunction(LossType.MEAN_SQUARED_ERROR)
        .randomSeed(42)
        .build();
```

With no hidden layer, the network learns a straight-line relationship. This is what makes the example simple linear regression.

## 9. Train the model

Configure the trainer and pass it the training set:

```java
neuralNet.getTrainer()
        .setStopEpochs(3000)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.SGD)
        .setShuffle(true);

neuralNet.train(trainingSet);
```

Mean Squared Error guides the optimizer toward a line that reduces squared prediction errors.

## 10. Evaluate on unseen data

Test the model with the reserved samples:

```java
RegressionMetrics metrics = (RegressionMetrics) neuralNet.test(testSet);
System.out.println(metrics);
```

Evaluation on `testSet` gives a more honest estimate than evaluating on the data used for training.

## 11. Save the complete pipeline

Attach the fitted standardizer before saving the trained network:

```java
neuralNet.setNormalizer(standardizer);

Files.createDirectories(Path.of("models"));
neuralNet.save(MODEL_PATH);
```

The saved model now carries the preprocessing expected by future input.

## 12. Predict execution time

Supply a new comparison count and read the continuous prediction:

```java
float comparisonCount = 100_000;
float predictedExecutionTime = neuralNet.predict(comparisonCount)[0];

System.out.printf("Predicted execution time for %.0f comparisons: %.2f ms%n",
        comparisonCount, predictedExecutionTime);
```

The result estimates execution time in milliseconds for the supplied comparison count.

## What you built

The completed program contains the full introductory workflow:

```text
Sorting benchmark CSV
        |
        v
Select feature and target with DFLib
        |
        v
One input feature
        |
        v
1 -> 1 linear model
        |
        v
Test-set regression metrics
        |
        v
Saved model and new prediction
```

## Run the complete project

The complete Java class, original dataset, `pom.xml`, and detailed README are available here:

<a class="github-example-button" href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/linear-regression"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.64 0 8.13c0 3.59 2.29 6.64 5.47 7.71.4.08.55-.18.55-.39 0-.19-.01-.83-.01-1.51-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.21-3.64-.9-3.64-4.01 0-.89.31-1.62.82-2.19-.08-.21-.36-1.04.08-2.16 0 0 .67-.22 2.2.84A7.5 7.5 0 0 1 8 3.92a7.5 7.5 0 0 1 2 .27c1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.95.08 2.16.51.57.82 1.3.82 2.19 0 3.12-1.87 3.8-3.65 4.01.29.25.54.74.54 1.5 0 1.08-.01 1.95-.01 2.22 0 .21.15.47.55.39A8.16 8.16 0 0 0 16 8.13C16 3.64 12.42 0 8 0Z"></path></svg><span>View Example on GitHub</span></a>
