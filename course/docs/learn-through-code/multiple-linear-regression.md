<a class="github-example-button" href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/multiple-linear-regression"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.64 0 8.13c0 3.59 2.29 6.64 5.47 7.71.4.08.55-.18.55-.39 0-.19-.01-.83-.01-1.51-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.21-3.64-.9-3.64-4.01 0-.89.31-1.62.82-2.19-.08-.21-.36-1.04.08-2.16 0 0 .67-.22 2.2.84A7.5 7.5 0 0 1 8 3.92a7.5 7.5 0 0 1 2 .27c1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.95.08 2.16.51.57.82 1.3.82 2.19 0 3.12-1.87 3.8-3.65 4.01.29.25.54.74.54 1.5 0 1.08-.01 1.95-.01 2.22 0 .21.15.47.55.39A8.16 8.16 0 0 0 16 8.13C16 3.64 12.42 0 8 0Z"></path></svg><span>View Example on GitHub</span></a>

# Build a Multiple Linear Regression Program

In this walkthrough, you will build the Computer Hardware Performance - Multiple Linear Regression example one part at a time.

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


## 1. Define the program configuration

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

## 2. Select CPU execution

At the beginning of `main`, disable CUDA:

```java
DeepNetts.getInstance().setUseCuda(false);
```

This model and dataset are small, so CPU execution is sufficient and easier to run on a development machine without a CUDA setup.

## 3. Load the CSV dataset

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

## 4. Inspect what was loaded

Print the number of samples and column names:

```java
System.out.println("Samples: " + dataSet.size());
System.out.println(
        "Columns: " + Arrays.toString(dataSet.getColumnNames())
);
```

This small check confirms that the program found the expected file and parsed its structure. It should report 209 samples and the seven expected CSV columns.

## 5. Shuffle and create a train/test split

Shuffle reproducibly, then reserve 20% of the data for testing:

```java
dataSet.shuffle(42);

TrainTestSplit split = dataSet.trainTestSplit(0.8);

DataSet<MLDataItem> trainingSet = split.getTrainingSet();
DataSet<MLDataItem> testSet = split.getTestSet();
```

The seed `42` makes the shuffle repeatable. The model learns from `trainingSet`; `testSet` stays unseen until evaluation.

## 6. Standardize the numerical features

Fit a standardizer on the training data and apply the same transformation to both subsets:

```java
Standardizer standardizer = new Standardizer(trainingSet);

standardizer.apply(trainingSet);
standardizer.apply(testSet);
```

Hardware features have very different ranges. Standardization puts them on comparable scales, which makes optimization easier. Fitting on training data only prevents test information from leaking into the training pipeline.

## 7. Build the linear model

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

## 8. Configure and run training

Configure the trainer before passing it the training set:

```java
neuralNet.getTrainer()
        .setStopEpochs(3000)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.SGD)
        .setShuffle(true);

neuralNet.train(trainingSet);
```

Training may run for up to 3000 epochs. Stochastic Gradient Descent updates the model parameters, and shuffling changes the sample order between passes.

## 9. Evaluate unseen data

Test the trained network with the reserved test set:

```java
RegressionMetrics metrics =
        (RegressionMetrics) neuralNet.test(testSet);

System.out.println(metrics);
```

Regression metrics describe the difference between predicted and actual `PRP` values. Testing on unseen samples provides a better estimate of generalization than measuring only training performance.

## 10. Save the model with preprocessing

Attach the fitted standardizer, create the model directory, and save:

```java
neuralNet.setNormalizer(standardizer);

Files.createDirectories(Path.of("models"));
neuralNet.save(MODEL_PATH);
```

The network was trained on standardized values, so future inputs must use the same transformation. Attaching the standardizer keeps preprocessing together with the saved model.

## 11. Predict computer performance

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
```

Pass the array to the trained network and read its first output:

```java
float predictedPerformance = neuralNet.predict(computer)[0];

System.out.printf(
        "Predicted relative performance: %.2f%n",
        predictedPerformance
);
```

The result is a continuous predicted `PRP` value. Feature order must remain identical to the order used during training.

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

## Run the complete project

The complete Java class, dataset, `pom.xml`, and detailed README are available here:

<a class="github-example-button" href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/multiple-linear-regression"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.64 0 8.13c0 3.59 2.29 6.64 5.47 7.71.4.08.55-.18.55-.39 0-.19-.01-.83-.01-1.51-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.21-3.64-.9-3.64-4.01 0-.89.31-1.62.82-2.19-.08-.21-.36-1.04.08-2.16 0 0 .67-.22 2.2.84A7.5 7.5 0 0 1 8 3.92a7.5 7.5 0 0 1 2 .27c1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.95.08 2.16.51.57.82 1.3.82 2.19 0 3.12-1.87 3.8-3.65 4.01.29.25.54.74.54 1.5 0 1.08-.01 1.95-.01 2.22 0 .21.15.47.55.39A8.16 8.16 0 0 0 16 8.13C16 3.64 12.42 0 8 0Z"></path></svg><span>View Example on GitHub</span></a>
