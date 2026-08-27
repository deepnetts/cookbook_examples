<a class="github-example-button" href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/regression/house-price-prediction">View Example on GitHub</a>

# House Price Prediction

This walkthrough builds a nonlinear regression model for prepared Boston Housing data.

**Problem:** Predict normalized median house value (`MEDV`) from normalized lower-status population percentage (`LSTAT`).

**Dataset:** 506 prepared Boston Housing observations.

## At a glance

| | |
|---|---|
| **ML task** | Nonlinear regression |
| **Input** | Normalized `LSTAT` |
| **Target** | Normalized `MEDV` |
| **Model** | `1 -> 16 -> 8 -> 1` |
| **Maximum training** | 1000 CPU epochs |

## 0. Configure the runtime

Verify Java, disable CUDA, and limit this small example to one CPU thread:

```java
verifyJavaRuntime();
DeepNetts.getInstance().setUseCuda(false);
DeepNetts.getInstance().setMaxThreads(1);
```

**Output:**

<pre class="console-output">WARNING: Using incubator modules: jdk.incubator.vector</pre>

The warning confirms that the required incubating Vector API module is enabled.

## 1. Load and inspect housing data

```java
TabularDataSet<MLDataItem> dataSet = DataSets.readCsv(
        DATASET_PATH, NUM_INPUTS, NUM_OUTPUTS, true, ",");
System.out.println("Samples: " + dataSet.size());
System.out.println("Columns: " + Arrays.toString(dataSet.getColumnNames()));
```

**Output:**

<pre class="console-output">Samples: 506
Columns: [LSTAT, MEDV]</pre>

This confirms that all 506 observations and the expected input and target columns were loaded.

## 2. Shuffle and split the dataset

```java
dataSet.shuffle(42);
TrainTestSplit split = dataSet.trainTestSplit(0.8);
DataSet<MLDataItem> trainingSet = split.getTrainingSet();
DataSet<MLDataItem> testSet = split.getTestSet();
```

The repeatable shuffle happens before the 80/20 split. The test subset remains unseen during training.

## 3. Standardize using training statistics

```java
Standardizer standardizer = new Standardizer(trainingSet);
standardizer.apply(trainingSet);
standardizer.apply(testSet);
```

The standardizer learns only from the training subset and then applies the same transformation to both subsets, avoiding test-data leakage.

## 4. Build the nonlinear regression model

```java
FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
        .addInputLayer(NUM_INPUTS)
        .addFullyConnectedLayer(16, ActivationType.TANH)
        .addFullyConnectedLayer(8, ActivationType.TANH)
        .addOutputLayer(NUM_OUTPUTS, ActivationType.LINEAR)
        .lossFunction(LossType.MEAN_SQUARED_ERROR)
        .randomSeed(42)
        .build();
```

The hidden layers let the model learn a nonlinear relationship between `LSTAT` and house value.

## 5. Configure and train the model

```java
neuralNet.getTrainer()
        .setStopEpochs(1000)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.SGD)
        .setShuffle(true);
neuralNet.train(trainingSet);
```

**Output:**

<pre class="console-output">TRAINING NEURAL NETWORK
-----------------------

Initial Train Error:0.9119935
Epoch:1, Time:16ms, TrainError:0.22411866, TrainErrorChange:-0.68787485, TrainAccuracy:-0.3662535
Epoch:2, Time:6ms, TrainError:0.01384652, TrainErrorChange:-0.21027215, TrainAccuracy:0.42621177
Epoch:3, Time:7ms, TrainError:0.010295863, TrainErrorChange:-0.003550657, TrainAccuracy:0.44327664
Epoch:4, Time:6ms, TrainError:0.010122934, TrainErrorChange:-1.729289E-4, TrainAccuracy:0.44961417
Epoch:5, Time:6ms, TrainError:0.00998128, TrainErrorChange:-1.4165416E-4, TrainAccuracy:0.45627666

TRAINING COMPLETED
Total Training Time: 55ms
-------------------------</pre>

`setStopEpochs(1000)` sets the maximum, not a requirement to execute every epoch. In this run, the trainer stopped after five epochs when its stopping condition was satisfied.

## 6. Evaluate the model

```java
RegressionMetrics metrics = (RegressionMetrics) neuralNet.test(testSet);
System.out.println(metrics);
```

**Output:**

<pre class="console-output">RegressionMetrics{
r2=0.2624389 Proportion of variance explained by the model. Intuitively how much the model prediction is better than using the mean value as prediction. A value between 0 and 1, where 1 is the best and 0 worst
meanSquaredError=0.016744772 Mean/average value of squared errors (the difference betwen actual and predicted value). Highly sensitive to large errors and outliers in inputs. The lower the better ideally 0.
rootMeanSquaredError=0.1294016 Squared root of the meanSquaredError. But in the same units as observerd value, makes it easier to interpret, and it is less sensitive to large error values. The lower the better ideally 0.
squaredErrorSum=1.691222 Total sum of squared errors. The lower the better.
meanAbsoluteError=0.104986146 Average error. Less sensitive to larger errors and outliers than meanSquaredError. The lower the better ideally 0.
meanAbsolutePercentageError=0.29628086 Mean/average of the absolute errors relative to their targets.Sensitive to relative erors
maxError=0.41368604 The biggest error in prediction by the regression model</pre>

These are held-out test metrics, not training results. The `r2` value of about 0.262 indicates that this one-feature model explains only part of the variation in normalized house values.

## 7. Save the model with preprocessing

```java
neuralNet.setNormalizer(standardizer);
Files.createDirectories(Path.of("models"));
neuralNet.save(MODEL_PATH);
```

Attaching the fitted standardizer preserves the preprocessing required by future inputs.

## 8. Predict a normalized house value

```java
float normalizedLstat = 0.12f;
float predictedValue = neuralNet.predict(normalizedLstat)[0];
System.out.printf("Predicted normalized MEDV: %.4f%n", predictedValue);
```

**Output:**

<pre class="console-output">Predicted normalized MEDV: 0.6008</pre>

The result is a normalized `MEDV` prediction for normalized `LSTAT = 0.12`; it is not a price in dollars.

## Run in NetBeans

Add this under **Project Properties → Run → VM Options**:

```text
--add-modules=jdk.incubator.vector
```

## What you built

```text
Normalized LSTAT
        ↓
Nonlinear regression network
        ↓
Predicted normalized MEDV
```

<div class="github-project-action">
<a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/regression/house-price-prediction">View Example on GitHub</a>
</div>

<a class="back-button" href="../">← Back to Regression Examples</a>
