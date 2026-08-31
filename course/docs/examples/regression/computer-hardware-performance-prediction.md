<a class="github-example-button" href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/regression/computer-hardware-performance-prediction"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.64 0 8.13c0 3.59 2.29 6.64 5.47 7.71.4.08.55-.18.55-.39 0-.19-.01-.83-.01-1.51-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.21-3.64-.9-3.64-4.01 0-.89.31-1.62.82-2.19-.08-.21-.36-1.04.08-2.16 0 0 .67-.22 2.2.84A7.5 7.5 0 0 1 8 3.92a7.5 7.5 0 0 1 2 .27c1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.95.08 2.16.51.57.82 1.3.82 2.19 0 3.12-1.87 3.8-3.65 4.01.29.25.54.74.54 1.5 0 1.08-.01 1.95-.01 2.22 0 .21.15.47.55.39A8.16 8.16 0 0 0 16 8.13C16 3.64 12.42 0 8 0Z"></path></svg><span>View Example on GitHub</span></a>

# Computer Hardware Performance Prediction

This walkthrough builds a computer hardware performance predictor one part at a time. It demonstrates multiple linear regression: predicting one continuous numerical value from several numerical features.

**Problem:** Predict published relative computer performance from six hardware characteristics.

**Dataset:** 209 computers with six numerical features and the continuous `PRP` target.

## At a glance

| | |
|---|---|
| **ML task** | Regression |
| **Level** | Beginner |
| **Dataset** | 209 computer hardware records |
| **Inputs** | Six numerical hardware characteristics |
| **Target** | `PRP` - Published Relative Performance |
| **Model** | `6 -> 1` feed-forward network with a linear output |
| **Default training** | 3000 CPU epochs |
| **Related concepts** | [Machine Learning Basics](../../lectures/01-ml-basics.md), [Linear Regression](../../lectures/02-linear-regression.md), [Neural Networks](../../lectures/02-neural-networks.md), [Backpropagation](../../lectures/05-backpropagation.md), [Deep Netts API](../../lectures/03-deep-netts-api.md), [Model Development](../../lectures/04-model-development.md) |

The model receives six hardware features:

```text
MYCT, MMIN, MMAX, CACH, CHMIN, CHMAX
```

and predicts one continuous target:

```text
PRP - Published Relative Performance
```

The complete flow is:

```text
load -> inspect -> split -> standardize -> build -> train -> evaluate -> save -> predict
```


## 0. Define the program configuration

Start by defining where the dataset and trained model are stored, along with the expected input and output sizes:

```java
private static final String DATASET_PATH =
        "src/main/resources/datasets/computer_hardware.csv";

private static final String MODEL_PATH =
        "models/computer-hardware-multiple-regression.dnet";

private static final int NUM_INPUTS = 6;
private static final int NUM_OUTPUTS = 1;
```

`NUM_INPUTS` matches the six feature columns. `NUM_OUTPUTS` is one because the model predicts one `PRP` value. Keeping these values in constants makes the dataset contract visible at the top of the class.

## 1. Configure the runtime

Verify Java and disable CUDA at the beginning of `main`:

```java
verifyJavaRuntime();
DeepNetts.getInstance().setUseCuda(false);
```

**Output:**

<pre class="console-output">WARNING: Using incubator modules: jdk.incubator.vector</pre>

The example requires Java 25 with the Vector API enabled. This model and dataset
are small, so CPU execution is sufficient and easier to run without CUDA.

## 2. Load the CSV dataset

Read the prepared CSV with the Deep Netts `DataSets` API:

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

The final two arguments say that the file contains a header and uses a comma delimiter. Deep Netts treats the first six columns as inputs and the final column as the output.

## 3. Inspect what was loaded

Print the number of samples and column names:

```java
System.out.println("Samples: " + dataSet.size());
System.out.println(
        "Columns: " + Arrays.toString(dataSet.getColumnNames())
);
```

**Output:**

<pre class="console-output">Samples: 209
Columns: [MYCT, MMIN, MMAX, CACH, CHMIN, CHMAX, PRP]</pre>

This small check confirms that the program found the expected file and parsed its structure. It should report 209 samples and the seven expected CSV columns.

## 4. Shuffle and create a train/test split

Shuffle reproducibly, then reserve 20% of the data for testing:

```java
dataSet.shuffle(42);

TrainTestSplit split = dataSet.trainTestSplit(0.8);

DataSet<MLDataItem> trainingSet = split.getTrainingSet();
DataSet<MLDataItem> testSet = split.getTestSet();
```

The seed `42` makes the shuffle repeatable. The model learns from `trainingSet`; `testSet` stays unseen until evaluation.

## 5. Standardize the numerical features

Fit a standardizer on the training data and apply the same transformation to both subsets:

```java
Standardizer standardizer = new Standardizer(trainingSet);

standardizer.apply(trainingSet);
standardizer.apply(testSet);
```

Hardware features have very different ranges. Standardization puts them on comparable scales, which makes optimization easier. Fitting on training data only prevents test information from leaking into the training pipeline.

## 6. Build the linear model

Create a network with six inputs and one Linear output:

```java
FeedForwardNetwork neuralNet =
        FeedForwardNetwork.builder()
                .addInputLayer(NUM_INPUTS)
                .addOutputLayer(NUM_OUTPUTS, ActivationType.LINEAR)
                .lossFunction(LossType.MEAN_SQUARED_ERROR)
                .randomSeed(42)
                .build();
```

The architecture is:

```text
6 -> 1
```

There are no hidden layers. The network therefore learns a weighted linear combination of the six inputs. Linear activation allows unrestricted numerical predictions, while Mean Squared Error measures regression error during training.

## 7. Configure and run training

Configure the trainer before passing it the training set:

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
------------------------------------------------------------------------

Initial Train Error:13374.919
Epoch:1, Time:4ms, TrainError:10256.736, TrainErrorChange:-3118.1826, TrainAccuracy:0.10615444
Epoch:2, Time:1ms, TrainError:6175.8213, TrainErrorChange:-4080.915, TrainAccuracy:0.40210462
Epoch:3, Time:1ms, TrainError:4314.934, TrainErrorChange:-1860.8872, TrainAccuracy:0.56161463
...
Epoch:3000, Time:0ms, TrainError:1249.1343, TrainErrorChange:1.1842041, TrainAccuracy:0.8521152

TRAINING COMPLETED
Total Training Time: 475ms
------------------------------------------------------------------------</pre>

The middle epochs are omitted for readability. Training error falls sharply in
the first few epochs and later stabilizes around 1,249. SGD completes all 3,000
epochs in this run.

## 8. Evaluate unseen data

Test the trained network with the reserved test set:

```java
RegressionMetrics metrics = (RegressionMetrics) neuralNet.test(testSet);
System.out.println(metrics);
```

**Output:**

<pre class="console-output">RegressionMetrics{
r2=0.84360945 Proportion of variance explained by the model. Intuitively how much the model prediction is better than using the mean value as prediction. A value between 0 and 1, where 1 is the best and 0 worst
meanSquaredError=9912.942 Mean/average value of squared errors (the difference betwen actual and predicted value). Highly sensitive to large errors and outliers in inputs. The lower the better ideally 0.
rootMeanSquaredError=99.56376 Squared root of the meanSquaredError. But in the same units as observerd value, makes it easier to interpret, and it is less sensitive to large error values. The lower the better ideally 0.
squaredErrorSum=406430.66 Total sum of squared errors. The lower the better.
meanAbsoluteError=45.59372 Average error. Less sensitive to larger errors and outliers than meanSquaredError. The lower the better ideally 0.
meanAbsolutePercentageError=0.5898638 Mean/average of the absolute errors relative to their targets.Sensitive to relative erors
maxError=504.1809 The biggest error in prediction by the regression model</pre>

The held-out `r2` of about 0.844 means the model explains a substantial share
of the PRP variance. RMSE, MAE, and the maximum error show that some numerical
prediction errors remain large, so `r2` should not be read in isolation.

## 9. Save the model with preprocessing

Attach the fitted standardizer, create the model directory, and save:

```java
neuralNet.setNormalizer(standardizer);

Files.createDirectories(Path.of("models"));
neuralNet.save(MODEL_PATH);
```

The network was trained on standardized values, so future inputs must use the same transformation. Attaching the standardizer keeps preprocessing together with the saved model.

## 10. Predict computer performance

Represent a new computer using the same feature order as the CSV:

```java
float[] computer = {
        26,       // MYCT
        16000,    // MMIN
        32000,    // MMAX
        64,       // CACH
        16,       // CHMIN
        24        // CHMAX
};
float predictedPerformance = neuralNet.predict(computer)[0];
System.out.printf("Predicted relative performance: %.2f%n", predictedPerformance);
```

**Output:**

<pre class="console-output">Predicted relative performance: 404.55</pre>

The result is a continuous predicted `PRP` value. Feature order must remain
identical to the order used during training.

## Run the example

Pass this option to the Java process through your IDE's application run configuration or the command line:

```text
--add-modules=jdk.incubator.vector
```

## What you built

You assembled a complete regression pipeline:

```text
Computer Hardware CSV
        |
        v
80/20 train/test split
        |
        v
Standardization
        |
        v
6 -> 1 linear model
        |
        v
Training and regression evaluation
        |
        v
Saved model and new prediction
```

<div class="github-project-action">
<a class="github-example-button" href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/regression/computer-hardware-performance-prediction"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.64 0 8.13c0 3.59 2.29 6.64 5.47 7.71.4.08.55-.18.55-.39 0-.19-.01-.83-.01-1.51-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.21-3.64-.9-3.64-4.01 0-.89.31-1.62.82-2.19-.08-.21-.36-1.04.08-2.16 0 0 .67-.22 2.2.84A7.5 7.5 0 0 1 8 3.92a7.5 7.5 0 0 1 2 .27c1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.95.08 2.16.51.57.82 1.3.82 2.19 0 3.12-1.87 3.8-3.65 4.01.29.25.54.74.54 1.5 0 1.08-.01 1.95-.01 2.22 0 .21.15.47.55.39A8.16 8.16 0 0 0 16 8.13C16 3.64 12.42 0 8 0Z"></path></svg><span>View Example on GitHub</span></a>
</div>

<a class="back-button" href="../../">← Back to Examples</a>
