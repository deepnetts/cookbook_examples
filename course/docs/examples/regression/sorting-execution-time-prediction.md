<a class="github-example-button" href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/regression/sorting-execution-time-prediction"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.64 0 8.13c0 3.59 2.29 6.64 5.47 7.71.4.08.55-.18.55-.39 0-.19-.01-.83-.01-1.51-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.21-3.64-.9-3.64-4.01 0-.89.31-1.62.82-2.19-.08-.21-.36-1.04.08-2.16 0 0 .67-.22 2.2.84A7.5 7.5 0 0 1 8 3.92a7.5 7.5 0 0 1 2 .27c1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.95.08 2.16.51.57.82 1.3.82 2.19 0 3.12-1.87 3.8-3.65 4.01.29.25.54.74.54 1.5 0 1.08-.01 1.95-.01 2.22 0 .21.15.47.55.39A8.16 8.16 0 0 0 16 8.13C16 3.64 12.42 0 8 0Z"></path></svg><span>View Example on GitHub</span></a>

# Sorting Execution Time Prediction

This walkthrough builds a sorting execution-time predictor one part at a time. It demonstrates simple linear regression: predicting one continuous numerical value from one numerical feature.

**Problem:** Predict sorting execution time from the number of comparisons.

**Dataset:** 903 sorting benchmark measurements with one numerical feature and one continuous target.

## At a glance

| | |
|---|---|
| **ML task** | Regression |
| **Level** | Beginner |
| **Dataset** | 903 sorting benchmark measurements |
| **Input** | One numerical feature: `comparison_count` |
| **Target** | One continuous value: `execution_time_ms` |
| **Model** | `1 -> 1` feed-forward network with a linear output |
| **Default training** | 3000 CPU epochs |
| **Related concepts** | [Machine Learning Basics](../../lectures/01-ml-basics.md), [Linear Regression](../../lectures/02-linear-regression.md), [Backpropagation](../../lectures/05-backpropagation.md), [Deep Netts API](../../lectures/03-deep-netts-api.md), [Model Development](../../lectures/04-model-development.md) |

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


## 0. Configure the program

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

## 1. Configure the runtime

Verify Java and disable CUDA at the start of `main`:

```java
verifyJavaRuntime();
DeepNetts.getInstance().setUseCuda(false);
```

**Output:**

<pre class="console-output">WARNING: Using incubator modules: jdk.incubator.vector</pre>

The warning confirms that the required incubating Vector API is enabled. This introductory model and dataset are small enough to run efficiently on CPU.

## 2. Select the model columns

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

## 3. Load the dataset

Read the generated two-column CSV with Deep Netts:

```java
TabularDataSet<MLDataItem> dataSet =
        DataSets.readCsv(DATASET_PATH, NUM_INPUTS, NUM_OUTPUTS, true, ",");
```

Deep Netts interprets the first column as the input and the final column as the target.

## 4. Inspect the data

Confirm the number of samples and column order:

```java
System.out.println("Samples: " + dataSet.size());
System.out.println("Columns: " + Arrays.toString(dataSet.getColumnNames()));
```

**Output:**

<pre class="console-output">Samples: 903
Columns: [comparison_count, execution_time_ms]</pre>

The output confirms that all 903 samples and the two selected columns were loaded in the expected order.

## 5. Create train and test sets

Shuffle reproducibly, then reserve 20% of the samples for evaluation:

```java
dataSet.shuffle(42);

TrainTestSplit split = dataSet.trainTestSplit(0.8);

DataSet<MLDataItem> trainingSet = split.getTrainingSet();
DataSet<MLDataItem> testSet = split.getTestSet();
```

The model learns only from `trainingSet`. The fixed seed keeps repeated experiments comparable.

## 6. Standardize the feature

Fit preprocessing only on training data and apply the same transformation to both subsets:

```java
Standardizer standardizer = new Standardizer(trainingSet);

standardizer.apply(trainingSet);
standardizer.apply(testSet);
```

Keeping the test set out of the fitting step prevents data leakage.

## 7. Build a 1 to 1 model

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

## 8. Configure and train the model

Configure the trainer and pass it the training set:

```java
neuralNet.getTrainer()
        .setStopEpochs(3000)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.SGD)
        .setShuffle(true);

neuralNet.train(trainingSet);
```

**Output:**

<pre class="console-output">TRAINING NEURAL NETWORK
-----------------------

Initial Train Error:510122.28
Epoch:1, Time:5ms, TrainError:287451.84, TrainErrorChange:-222670.44, TrainAccuracy:0.50591326
Epoch:2, Time:1ms, TrainError:94482.77, TrainErrorChange:-192969.06, TrainAccuracy:0.79503703
Epoch:3, Time:1ms, TrainError:49488.473, TrainErrorChange:-44994.3, TrainAccuracy:0.8597123
...
Epoch:3000, Time:0ms, TrainError:35741.2, TrainErrorChange:8.5859375, TrainAccuracy:0.88076025

TRAINING COMPLETED
Total Training Time: 2235ms
---------------------------</pre>

The middle epochs are omitted for readability. Mean Squared Error falls sharply during the first epochs, and this run completes all 3,000 configured epochs.

## 9. Evaluate on unseen data

Test the model with the reserved samples:

```java
RegressionMetrics metrics = (RegressionMetrics) neuralNet.test(testSet);
System.out.println(metrics);
```

**Output:**

<pre class="console-output">RegressionMetrics{
r2=0.8672889 Proportion of variance explained by the model. Intuitively how much the model prediction is better than using the mean value as prediction. A value between 0 and 1, where 1 is the best and 0 worst
meanSquaredError=78743.37 Mean/average value of squared errors (the difference betwen actual and predicted value). Highly sensitive to large errors and outliers in inputs. The lower the better ideally 0.
rootMeanSquaredError=280.6125 Squared root of the meanSquaredError. But in the same units as observerd value, makes it easier to interpret, and it is less sensitive to large error values. The lower the better ideally 0.
squaredErrorSum=1.4173806E7 Total sum of squared errors. The lower the better.
meanAbsoluteError=181.06033 Average error. Less sensitive to larger errors and outliers than meanSquaredError. The lower the better ideally 0.
meanAbsolutePercentageError=0.7629041 Mean/average of the absolute errors relative to their targets.Sensitive to relative erors
maxError=689.8218 The biggest error in prediction by the regression model</pre>

These are held-out test metrics, not training results. The `r2` of about 0.867 shows that the linear model explains most of the observed execution-time variance, while the error metrics quantify the remaining differences in milliseconds.

## 10. Save the complete pipeline

Attach the fitted standardizer before saving the trained network:

```java
neuralNet.setNormalizer(standardizer);

Files.createDirectories(Path.of("models"));
neuralNet.save(MODEL_PATH);
```

The saved model now carries the preprocessing expected by future input.

## 11. Predict execution time

Supply a new comparison count and read the continuous prediction:

```java
float comparisonCount = 100_000;
float predictedExecutionTime = neuralNet.predict(comparisonCount)[0];

System.out.printf("Predicted execution time for %.0f comparisons: %.2f ms%n",
        comparisonCount, predictedExecutionTime);
```

**Output:**

<pre class="console-output">Predicted execution time for 100000 comparisons: 337.74 ms</pre>

The result estimates an execution time of `337.74 ms` for 100,000 comparisons.

## Run in NetBeans

Add this under **Project Properties → Run → VM Options**:

```text
--add-modules=jdk.incubator.vector
```

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

<div class="github-project-action">
<a class="github-example-button" href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/regression/sorting-execution-time-prediction"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.64 0 8.13c0 3.59 2.29 6.64 5.47 7.71.4.08.55-.18.55-.39 0-.19-.01-.83-.01-1.51-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.21-3.64-.9-3.64-4.01 0-.89.31-1.62.82-2.19-.08-.21-.36-1.04.08-2.16 0 0 .67-.22 2.2.84A7.5 7.5 0 0 1 8 3.92a7.5 7.5 0 0 1 2 .27c1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.95.08 2.16.51.57.82 1.3.82 2.19 0 3.12-1.87 3.8-3.65 4.01.29.25.54.74.54 1.5 0 1.08-.01 1.95-.01 2.22 0 .21.15.47.55.39A8.16 8.16 0 0 0 16 8.13C16 3.64 12.42 0 8 0Z"></path></svg><span>View Example on GitHub</span></a>
</div>

<a class="back-button" href="../../">← Back to Examples</a>
