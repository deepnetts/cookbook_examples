<a class="github-example-button" href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/regression/insurance-payment-prediction">View Example on GitHub</a>

# Insurance Payment Prediction

This walkthrough uses simple linear regression to estimate total Swedish auto-insurance payments from the number of claims.

**Problem:** Predict the normalized total insurance payment from the normalized number of claims.

**Dataset:** 63 normalized claim-count and payment pairs from the Swedish Auto Insurance dataset.

## At a glance

| | |
|---|---|
| **ML task** | Simple linear regression |
| **Input** | Normalized claim count |
| **Target** | Normalized total payment |
| **Model** | `1 -> 1` linear network |
| **Maximum training** | 1500 CPU epochs |

## 0. Configure the runtime

Verify Java, disable CUDA, and use one CPU thread for this small example:

```java
verifyJavaRuntime();
DeepNetts.getInstance().setUseCuda(false);
DeepNetts.getInstance().setMaxThreads(1);
```

**Output:**

<pre class="console-output">WARNING: Using incubator modules: jdk.incubator.vector</pre>

The warning confirms that the required incubating Vector API module is enabled.

## 1. Load the dataset

```java
TabularDataSet<MLDataItem> dataSet = DataSets.readCsv(
        DATASET_PATH, NUM_INPUTS, NUM_OUTPUTS, false, ",");
System.out.println("Samples: " + dataSet.size());
```

**Output:**

<pre class="console-output">Samples: 63</pre>

The CSV has no header, so the `false` argument tells the loader to read all 63 rows as data.

## 2. Shuffle and split the dataset

```java
dataSet.shuffle(42);
TrainTestSplit split = dataSet.trainTestSplit(0.8);
DataSet<MLDataItem> trainingSet = split.getTrainingSet();
DataSet<MLDataItem> testSet = split.getTestSet();
```

The fixed seed makes the shuffle repeatable. The model trains on 80% of the rows, while the remaining 20% are reserved for evaluation.

## 3. Standardize using training statistics

```java
Standardizer standardizer = new Standardizer(trainingSet);
standardizer.apply(trainingSet);
standardizer.apply(testSet);
```

The standardizer is fitted only on the training subset and applies the same transformation to both subsets, preventing test-data leakage.

## 4. Build the one-input linear model

```java
FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
        .addInputLayer(NUM_INPUTS)
        .addOutputLayer(NUM_OUTPUTS, ActivationType.LINEAR)
        .lossFunction(LossType.MEAN_SQUARED_ERROR)
        .randomSeed(42)
        .build();
```

With no hidden layer, the network learns a straight-line relationship between normalized claim count and normalized payment.

## 5. Configure and train the model

```java
neuralNet.getTrainer()
        .setStopEpochs(1500)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.SGD)
        .setShuffle(true);
neuralNet.train(trainingSet);
```

**Output:**

<pre class="console-output">TRAINING NEURAL NETWORK
-----------------------

Initial Train Error:0.41509396
Epoch:1, Time:4ms, TrainError:0.39658397, TrainErrorChange:-0.018509984, TrainAccuracy:-15.18792
Epoch:2, Time:1ms, TrainError:0.35943866, TrainErrorChange:-0.037145317, TrainAccuracy:-13.672191
Epoch:3, Time:1ms, TrainError:0.32580897, TrainErrorChange:-0.033629686, TrainAccuracy:-12.300019
...
Epoch:43, Time:0ms, TrainError:0.009833959, TrainErrorChange:-6.3251145E-4, TrainAccuracy:0.5908178

TRAINING COMPLETED
Total Training Time: 29ms
-------------------------</pre>

The middle epochs are omitted for readability. `setStopEpochs(1500)` defines the maximum; this run stopped after epoch 43 when the trainer's stopping condition was satisfied.

## 6. Evaluate the model

```java
RegressionMetrics metrics = (RegressionMetrics) neuralNet.test(testSet);
System.out.println(metrics);
```

**Output:**

<pre class="console-output">RegressionMetrics{
r2=0.35352463 Proportion of variance explained by the model. Intuitively how much the model prediction is better than using the mean value as prediction. A value between 0 and 1, where 1 is the best and 0 worst
meanSquaredError=0.01403295 Mean/average value of squared errors (the difference betwen actual and predicted value). Highly sensitive to large errors and outliers in inputs. The lower the better ideally 0.
rootMeanSquaredError=0.11846075 Squared root of the meanSquaredError. But in the same units as observerd value, makes it easier to interpret, and it is less sensitive to large error values. The lower the better ideally 0.
squaredErrorSum=0.1683954 Total sum of squared errors. The lower the better.
meanAbsoluteError=0.10467377 Average error. Less sensitive to larger errors and outliers than meanSquaredError. The lower the better ideally 0.
meanAbsolutePercentageError=0.6737321 Mean/average of the absolute errors relative to their targets.Sensitive to relative erors
maxError=0.2476909 The biggest error in prediction by the regression model</pre>

These values measure performance on the held-out test subset. An `r2` of about 0.354 means the one-input linear model explains part, but not all, of the variation in normalized payments.

## 7. Save the model with preprocessing

```java
neuralNet.setNormalizer(standardizer);
Files.createDirectories(Path.of("models"));
neuralNet.save(MODEL_PATH);
```

Attaching the fitted standardizer keeps the required preprocessing with the saved model.

## 8. Predict a normalized payment

```java
float normalizedClaimCount = 0.25f;
float predictedPayment = neuralNet.predict(normalizedClaimCount)[0];
System.out.printf("Predicted normalized payment: %.4f%n", predictedPayment);
```

**Output:**

<pre class="console-output">Predicted normalized payment: 0.2446</pre>

This is a normalized payment prediction for normalized claim count `0.25`; it is not a currency amount.

## Run in NetBeans

Add this under **Project Properties → Run → VM Options**:

```text
--add-modules=jdk.incubator.vector
```

## What you built

```text
Claim count → linear model → predicted total payment
```

<div class="github-project-action">
<a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/regression/insurance-payment-prediction">View Example on GitHub</a>
</div>

<a class="back-button" href="../">← Back to Regression Examples</a>
