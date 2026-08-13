# Computer Hardware Performance - Multiple Linear Regression with Deep Netts

This example demonstrates a complete **multiple linear regression workflow** using Deep Netts.

The goal is to predict the relative performance of a computer from several hardware characteristics.

The project is intended for Java developers who want to understand the basic machine learning workflow while working with a familiar Java API.

The Java code is intentionally compact. This README explains the main machine learning concepts behind each step.

The same project can also be used as a **template for other regression problems**.

---

## Problem

The goal is to predict:

```text
PRP = Published Relative Performance
```

of a computer from six hardware characteristics.

Unlike classification, where the output is a class such as:

```text
SPAM / NOT SPAM
```

regression predicts a **continuous numerical value**.

Example:

```text
Input hardware characteristics
        |
        v
Linear regression model
        |
        v
Predicted relative performance: 347.25
```

---

## Dataset

The example uses the **Computer Hardware** dataset from the UCI Machine Learning Repository.

The prepared CSV used by this project contains:

```text
209 samples
6 numerical input features
1 numerical target
```

The dataset is located at:

```text
src/main/resources/datasets/computer_hardware.csv
```

CSV structure:

```csv
MYCT,MMIN,MMAX,CACH,CHMIN,CHMAX,PRP
```

The original dataset also contains vendor and model information.

Those categorical columns are intentionally excluded from this entry-level example so that the focus stays on numerical regression.

---

## Features

| Feature | Description |
|---|---|
| `MYCT` | Machine cycle time in nanoseconds |
| `MMIN` | Minimum main memory in KB |
| `MMAX` | Maximum main memory in KB |
| `CACH` | Cache memory in KB |
| `CHMIN` | Minimum number of channels |
| `CHMAX` | Maximum number of channels |
| `PRP` | Published relative performance - prediction target |

Example row:

```csv
26,16000,32000,64,16,24,465
```

This means:

```text
MYCT  = 26
MMIN  = 16000
MMAX  = 32000
CACH  = 64
CHMIN = 16
CHMAX = 24

PRP   = 465
```

The first six values are model inputs.

`PRP` is the value the model learns to predict.

---

## Project Structure

```text
multiple-linear-regression/
│
├── README.md
├── pom.xml
├── models/
│   └── computer-hardware-multiple-regression.dnet
│
└── src/
    └── main/
        ├── java/
        │   └── com/deepnetts/examples/multiplelinearregression/
        │       └── MultipleLinearRegressionDeepNetts.java
        │
        └── resources/
            └── datasets/
                └── computer_hardware.csv
```

---

## Requirements

This example uses:

```text
Java 22
Maven
Deep Netts 4.0.0-beta
```

Deep Netts 4 uses the Java Vector API.

When running the project, add:

```text
--add-modules jdk.incubator.vector
```

In Apache NetBeans:

```text
Project -> Properties -> Run -> VM Options
```

---

# Machine Learning Workflow

The example follows this complete regression workflow:

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
Standardize features
    |
    v
Build linear model
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

---

## 1. Runtime Configuration

CUDA is explicitly disabled:

```java
DeepNetts.getInstance().setUseCuda(false);
```

This is a small dataset and a very small model, so GPU acceleration is not required.

CPU execution also makes the example easier to run without a local CUDA configuration.

---

## 2. Load Data

The dataset is loaded using the Deep Netts `DataSets` API:

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

The example defines:

```java
private static final int NUM_INPUTS = 6;
private static final int NUM_OUTPUTS = 1;
```

The CSV therefore contains:

```text
6 input columns
+
1 target column
```

---

## 3. Inspect Data

After loading, the example prints basic information:

```java
System.out.println(
        "Samples: " + dataSet.size()
);

System.out.println(
        "Columns: " +
        Arrays.toString(dataSet.getColumnNames())
);
```

This provides a simple check that the expected dataset has been loaded.

Expected columns:

```text
[MYCT, MMIN, MMAX, CACH, CHMIN, CHMAX, PRP]
```

The dataset used by this example is already prepared.

For a real-world project, this stage could additionally include:

```text
missing-value analysis
invalid-value detection
outlier detection
duplicate removal
feature analysis
categorical encoding
feature engineering
```

Those operations depend on the dataset and are intentionally kept outside this small regression example.

---

## 4. Shuffle and Split

The dataset is shuffled:

```java
dataSet.shuffle(42);
```

Using a fixed random seed makes the experiment easier to reproduce.

The data is then divided into:

```text
80% training data
20% test data
```

using:

```java
TrainTestSplit split =
        dataSet.trainTestSplit(0.8);
```

The resulting datasets are:

```java
DataSet<MLDataItem> trainingSet =
        split.getTrainingSet();

DataSet<MLDataItem> testSet =
        split.getTestSet();
```

The **training set** is used to learn model parameters.

The **test set** remains unseen during training and is used later to evaluate the model.

---

## Why Keep Test Data Separate?

If the model were evaluated only on the same samples used for training, the result would not show how well it performs on new computers.

The intended workflow is:

```text
Training set
     |
     v
Learn model


Test set
     |
     v
Evaluate learned model
```

The test set provides an estimate of the model's ability to generalize to unseen data.

---

## 5. Standardize Input Features

The hardware features use very different numerical ranges.

For example:

```text
MYCT  -> tens or hundreds
MMIN  -> hundreds or thousands
MMAX  -> thousands or tens of thousands
CACH  -> small or medium numerical values
CHMIN -> small integers
CHMAX -> small or medium integers
```

For this reason, the example standardizes the input features:

```java
Standardizer standardizer =
        new Standardizer(trainingSet);

standardizer.apply(trainingSet);
standardizer.apply(testSet);
```

Standardization transforms features so that their numerical scales are more comparable.

This makes optimization easier because one large-valued feature does not dominate simply because of its numerical magnitude.

---

## Avoiding Data Leakage

The standardizer is created from:

```text
trainingSet
```

not from the complete dataset.

This is important.

Incorrect workflow:

```text
Complete dataset
      |
      v
Fit preprocessing
      |
      v
Train/Test split
```

This allows information from the future test set to influence preprocessing.

That is called:

```text
data leakage
```

Correct workflow:

```text
Dataset
   |
   v
Train/Test split
   |
   v
Fit preprocessing on TRAIN
   |
   +------------+
   |            |
   v            v
Train          Test
```

The same transformation is applied to the test data, but its parameters are determined only from training data.

---

# 6. Build the Linear Model

The model is created using a Deep Netts feed-forward neural network:

```java
FeedForwardNetwork neuralNet =
        FeedForwardNetwork.builder()
                .addInputLayer(NUM_INPUTS)
                .addOutputLayer(
                        NUM_OUTPUTS,
                        ActivationType.LINEAR
                )
                .lossFunction(
                        LossType.MEAN_SQUARED_ERROR
                )
                .randomSeed(42)
                .build();
```

The architecture is:

```text
6 -> 1
```

There are no hidden layers.

Graphically:

```text
MYCT  ──┐
MMIN  ──┤
MMAX  ──┤
CACH  ──┼──> LINEAR OUTPUT ──> predicted PRP
CHMIN ──┤
CHMAX ──┘
```

---

## Why Is This Multiple Linear Regression?

A neural network does not necessarily have to contain hidden layers.

This network contains:

```text
6 inputs
1 linear output
0 hidden layers
```

The output is calculated as a weighted combination of the input features plus a bias.

Conceptually:

```text
PRP =
    w1 * MYCT
  + w2 * MMIN
  + w3 * MMAX
  + w4 * CACH
  + w5 * CHMIN
  + w6 * CHMAX
  + bias
```

This is **multiple linear regression**.

It is called "multiple" because there are several input variables.

---

## Linear Output

The output uses:

```java
ActivationType.LINEAR
```

A linear activation is appropriate because regression needs to predict a numerical value rather than a probability or class.

Unlike Sigmoid, the output is not restricted to:

```text
0 - 1
```

This allows the model to predict values such as:

```text
25
185
465
1000
```

---

## Mean Squared Error

The model uses:

```java
LossType.MEAN_SQUARED_ERROR
```

Mean Squared Error measures the difference between:

```text
actual performance
```

and:

```text
predicted performance
```

During training, the model changes its weights in order to reduce this error.

---

# 7. Configure and Train

Training is configured using:

```java
neuralNet.getTrainer()
        .setStopEpochs(3000)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.SGD)
        .setShuffle(true);
```

Main parameters:

| Parameter | Value |
|---|---|
| Maximum epochs | 3000 |
| Learning rate | 0.001 |
| Optimizer | SGD |
| Shuffle | Enabled |

Training starts with:

```java
neuralNet.train(trainingSet);
```

During training, Deep Netts automatically performs forward propagation, loss calculation, backpropagation and parameter updates.

---

# 8. Evaluate the Model

After training, the model is evaluated using unseen test data:

```java
RegressionMetrics metrics =
        (RegressionMetrics) neuralNet.test(testSet);

System.out.println(metrics);
```

Common regression metrics include:

```text
MSE
RMSE
MAE
R²
```

---

## MSE - Mean Squared Error

MSE measures the average squared difference between predicted and actual values.

Lower values are better.

Because errors are squared, large errors are penalized more strongly.

---

## RMSE - Root Mean Squared Error

RMSE is the square root of MSE.

It is useful because it is expressed on the same general scale as the prediction target.

Lower values are better.

---

## MAE - Mean Absolute Error

MAE measures the average absolute difference between predictions and actual values.

For example:

```text
Actual PRP:    300
Predicted PRP: 280

Absolute error: 20
```

Lower MAE means predictions are closer to the real values on average.

---

## R² - Coefficient of Determination

R² indicates how much of the variation in the target is explained by the model.

In general:

```text
R² close to 1 -> strong fit
R² close to 0 -> weak predictive relationship
```

Regression models should normally be considered using several metrics rather than only one.

---

# 9. Save the Model

The preprocessing object is attached to the model:

```java
neuralNet.setNormalizer(standardizer);
```

This is important because the model was trained using standardized inputs.

The model directory is created:

```java
Files.createDirectories(
        Path.of("models")
);
```

and the trained model is saved:

```java
neuralNet.save(MODEL_PATH);
```

The resulting file is:

```text
models/computer-hardware-multiple-regression.dnet
```

Saving the model makes it possible to reuse the trained network without repeating training.

---

# 10. Predict Computer Performance

A new computer is represented using the same six features:

```java
float[] computer = {
        26,
        16000,
        32000,
        64,
        16,
        24
};
```

The order must match the training dataset:

```text
MYCT
MMIN
MMAX
CACH
CHMIN
CHMAX
```

Prediction is performed with:

```java
float predictedPerformance =
        neuralNet.predict(computer)[0];
```

Example output:

```text
Predicted relative performance: 420.56
```

The exact result depends on the trained model.

---

# Why the Java Code Is Intentionally Small

The goal of this example is to demonstrate the Deep Netts regression workflow rather than manually implement functionality already available in the library.

The important API calls remain easy to identify:

```java
DataSets.readCsv(...)

dataSet.trainTestSplit(...)

new Standardizer(...)

FeedForwardNetwork.builder()

neuralNet.getTrainer()

neuralNet.train(...)

neuralNet.test(...)

neuralNet.save(...)

neuralNet.predict(...)
```

The Java code shows **how** to perform the workflow.

This README explains **why** each step is required.

---

# Using This Example as a Regression Template

This project is not limited to computer hardware performance.

It can be used as a starting template for other **tabular regression problems** where the goal is to predict a continuous numerical value.

Examples:

```text
software execution time
server response latency
energy consumption
house price
development effort
network throughput
resource usage
product demand
```

The general workflow remains:

```text
Load
-> Inspect
-> Split
-> Preprocess
-> Build
-> Train
-> Evaluate
-> Save
-> Predict
```

---

## Adapting the Template

### 1. Replace the Dataset

Replace:

```text
computer_hardware.csv
```

with another numerical CSV dataset.

Then update:

```java
private static final String DATASET_PATH =
        "src/main/resources/datasets/your_dataset.csv";
```

---

### 2. Change the Number of Inputs

This example uses:

```java
private static final int NUM_INPUTS = 6;
```

If another dataset contains ten input features:

```java
private static final int NUM_INPUTS = 10;
```

The network automatically follows that value:

```java
.addInputLayer(NUM_INPUTS)
```

---

### 3. Define the New Target

The current target is:

```text
PRP = computer performance
```

In another project it could be:

```text
execution_time
price
latency
energy_usage
memory_usage
```

Regression is appropriate when the target is a continuous numerical value.

---

### 4. Choose Appropriate Preprocessing

This project standardizes numerical features because their ranges are very different.

Another dataset may require:

```text
different scaling
missing-value handling
categorical encoding
feature selection
outlier treatment
```

Any preprocessing learned from data should be fitted using the training set only.

---

### 5. Adapt the Model

For a linear regression problem, the architecture can remain:

```text
NUM_INPUTS -> 1 LINEAR OUTPUT
```

If the relationship between inputs and target is more complex and non-linear, hidden layers can be introduced.

For example:

```text
6 -> 32 -> 16 -> 1
```

That would no longer represent simple linear regression, but a non-linear neural-network regression model.

---

### 6. Adjust Training Hyperparameters

The current values:

```text
epochs        = 3000
learning rate = 0.001
optimizer     = SGD
```

are configuration choices for this example.

For another dataset, these may need to be changed.

Hyperparameters that can be tuned include:

```text
learning rate
number of epochs
optimizer
batch size
network architecture
```

---

## Template Checklist

When adapting this project to another regression problem:

- [ ] Replace the dataset
- [ ] Update `DATASET_PATH`
- [ ] Set the correct `NUM_INPUTS`
- [ ] Define the numerical target
- [ ] Inspect the dataset
- [ ] Choose appropriate preprocessing
- [ ] Split before fitting preprocessing
- [ ] Fit preprocessing on training data only
- [ ] Choose the model architecture
- [ ] Use a linear output for regression
- [ ] Choose an appropriate loss function
- [ ] Configure training hyperparameters
- [ ] Train on the training set
- [ ] Evaluate on unseen test data
- [ ] Check MSE, RMSE, MAE and R²
- [ ] Save the model
- [ ] Use identical feature order for prediction

---

# Summary

This example demonstrates **multiple linear regression** using Deep Netts and a real computer hardware dataset.

The model uses:

```text
6 numerical input features
1 continuous output
0 hidden layers
LINEAR output activation
Mean Squared Error loss
SGD optimization
```

Architecture:

```text
6 -> 1
```

Complete workflow:

```text
Hardware data
      |
      v
Train/Test split
      |
      v
Standardization
      |
      v
Linear model
      |
      v
Training
      |
      v
Regression evaluation
      |
      v
Save model
      |
      v
Predict performance
```

The example is intentionally compact so that Java developers can easily see the complete machine learning workflow.

The computer hardware problem provides one concrete use case, while the same project structure can be reused as a template for other regression problems.
