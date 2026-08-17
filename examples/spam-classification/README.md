# Email Spam Classification with Deep Netts

This example demonstrates a complete **binary classification workflow** using Deep Netts.

The concrete problem is email spam detection, but the project is also designed to be used as a **template for other classification problems**.

It is intended for Java developers who want to learn the basic machine learning workflow while working with a familiar Java API.

The Java code is intentionally kept compact. This README explains the main machine learning concepts behind each step.

---

## Problem

The goal is to classify an email as:

```text
0 = NOT SPAM
1 = SPAM
```

The neural network receives five numerical features and predicts the probability that an email belongs to the spam class.

A probability threshold of `0.5` is used:

```text
probability < 0.5  -> NOT SPAM
probability >= 0.5 -> SPAM
```

---

## Dataset
The dataset is from:

```text
https://www.kaggle.com/datasets/smayanj/spam-detection-dataset
```

The dataset is located at:

```text
src/main/resources/datasets/spam_detection_dataset.csv
```

It contains five input features and one binary target:

```csv
num_links,num_words,has_offer,sender_score,all_caps,is_spam
```

### Input features

| Feature | Description |
|---|---|
| `num_links` | Number of links in the email |
| `num_words` | Number of words in the email |
| `has_offer` | Whether the email contains an offer (`0` or `1`) |
| `sender_score` | Numerical sender reliability score |
| `all_caps` | Whether the email contains all-caps text (`0` or `1`) |

Target:

```text
is_spam
```

with:

```text
0 = NOT SPAM
1 = SPAM
```

---

## Project Structure

```text
SpamClassificationDeepNetts/
│
├── README.md
├── pom.xml
├── models/
│   └── spam-classifier.dnet
│
└── src/
    └── main/
        ├── java/
        │   └── com/deepnetts/examples/spamclassificationdeepnetts/
        │       └── SpamClassificationDeepNetts.java
        │
        └── resources/
            └── datasets/
                └── spam_detection_dataset.csv
```

---

## Requirements

This example uses:

```text
Java 25
Maven
Deep Netts 4.0.0-beta
```

Deep Netts 4 uses the Java Vector API.

When running the example, add:

```text
--add-modules jdk.incubator.vector
```

In Apache NetBeans:

```text
Project -> Properties -> Run -> VM Options
```

---

# Machine Learning Workflow

The example follows this workflow:

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
Scale features
    |
    v
Build neural network
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

The dataset and neural network are small enough to run efficiently on CPU.

This also keeps the example simple and avoids requiring a CUDA installation.

---

## 2. Load Data

The CSV dataset is loaded with:

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

For this dataset:

```java
private static final int NUM_INPUTS = 5;
private static final int NUM_OUTPUTS = 1;
```

The first five columns are inputs and the last column is the target.

---

## 3. Inspect Data

The example performs a basic check after loading:

```java
System.out.println("Samples: " + dataSet.size());

System.out.println(
        "Columns: " +
        Arrays.toString(dataSet.getColumnNames())
);
```

This verifies that the expected dataset has been loaded.

For a real-world dataset, this stage may also include:

```text
missing-value checks
invalid values
class distribution
outlier detection
categorical encoding
feature engineering
```

This example uses a prepared dataset, so those steps are intentionally kept outside the main code.

---

## 4. Shuffle and Split

Before splitting, the dataset is shuffled:

```java
dataSet.shuffle(42);
```

The fixed random seed makes the experiment easier to reproduce.

The dataset is then split into:

```text
80% training data
20% test data
```

using:

```java
TrainTestSplit split =
        dataSet.trainTestSplit(0.8);
```

The **training set** is used to learn the neural-network parameters.

The **test set** is kept separate and is used only after training to evaluate performance on unseen data.

This separation gives a more realistic estimate of how the model will behave on new examples.

---

## 5. Preprocessing

The input features have different numerical ranges.

For example:

```text
num_words    -> tens or hundreds
num_links    -> small integers
sender_score -> approximately 0 to 1
has_offer    -> 0 or 1
all_caps     -> 0 or 1
```

The example therefore uses Min-Max scaling:

```java
MinMaxScaler scaler =
        DataSets.scaleToMinMax(trainingSet);

scaler.apply(testSet);
```

The scaler is fitted using the **training set only**.

This is important because preprocessing the complete dataset before splitting would allow information from the test set to influence the training pipeline.

That is known as **data leakage**.

Correct workflow:

```text
Dataset
   |
   v
Train/Test split
   |
   v
Fit scaler on TRAIN
   |
   +----------+
   |          |
   v          v
Train        Test
scaled      scaled
```

---

## 6. Build the Neural Network

The model is a feed-forward neural network:

```text
5 -> 32 -> 16 -> 1
```

It is created with:

```java
FeedForwardNetwork neuralNet =
        FeedForwardNetwork.builder()
                .addInputLayer(NUM_INPUTS)
                .addFullyConnectedLayer(32)
                .addFullyConnectedLayer(16)
                .addOutputLayer(
                        NUM_OUTPUTS,
                        ActivationType.SIGMOID
                )
                .lossFunction(LossType.CROSS_ENTROPY)
                .randomSeed(42)
                .build();
```

Architecture:

```text
5 input features
      |
      v
32 hidden neurons
      |
      v
16 hidden neurons
      |
      v
1 sigmoid output
      |
      v
spam probability
```

The output layer uses **Sigmoid** because this is a binary classification problem.

The result is a value between `0` and `1`.

The network uses **Cross-Entropy** as the loss function, which is appropriate for classification.

---

## 7. Configure and Train

Training is configured with:

```java
neuralNet.getTrainer()
        .setStopEpochs(50)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.SGD)
        .setBatchMode(true)
        .setBatchSize(64)
        .setShuffle(true);
```

Main training parameters:

| Parameter | Value |
|---|---|
| Epochs | 50 |
| Learning rate | 0.001 |
| Optimizer | SGD |
| Batch size | 64 |
| Shuffle | Enabled |

Training starts with:

```java
neuralNet.train(trainingSet);
```

During training, Deep Netts calculates predictions, compares them with the correct targets and updates the network weights using backpropagation.

---

## 8. Evaluate

The trained model is evaluated on the test set:

```java
ClassificationMetrics metrics =
        (ClassificationMetrics) neuralNet.test(testSet);

System.out.println(metrics);
```

For classification problems, useful metrics include:

```text
Accuracy
Precision
Recall
F1 Score
Confusion Matrix
```

### Accuracy

Percentage of all correctly classified emails.

### Precision

Of all emails predicted as spam, how many were actually spam?

### Recall

Of all actual spam emails, how many were detected?

### F1 Score

Combines precision and recall into a single metric.

Accuracy alone may not be enough, especially when one class appears much more frequently than another.

---

## 9. Save the Model

The scaler is attached to the neural network:

```java
neuralNet.setNormalizer(scaler);
```

This is important because future input must use the same preprocessing as the data used during training.

The model is then saved:

```java
Files.createDirectories(Path.of("models"));

neuralNet.save(MODEL_PATH);
```

The resulting file is:

```text
models/spam-classifier.dnet
```

Saving the model allows it to be reused later without training from scratch.

---

## 10. Predict a New Email

A new email is represented using the same five features:

```java
float[] email = {
        4,
        55,
        1,
        0.35f,
        1
};
```

The order must match the training dataset:

```text
num_links
num_words
has_offer
sender_score
all_caps
```

Prediction:

```java
float spamProbability =
        neuralNet.predict(email)[0];
```

The probability is converted into a class:

```java
spamProbability >= 0.5f
        ? "SPAM"
        : "NOT SPAM";
```

For example:

```text
Spam probability: 0.87
SPAM
```

The final prediction in this example uses the model that was trained during the same program execution.

The trained network is also saved to a `.dnet` file so it can later be loaded and used independently from the training process.

---

# Using This Example as a Template

This project is not intended only as a spam classifier.

It demonstrates a general structure that can be reused for other **tabular classification problems**, such as:

```text
fraud detection
customer churn
loan-risk classification
medical classification
quality control
network intrusion detection
```

The overall workflow usually remains the same:

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

What changes is mainly the **dataset and model configuration**.

---

## Adapting the Template

### 1. Replace the dataset

Replace:

```text
spam_detection_dataset.csv
```

with your own CSV file and update:

```java
private static final String DATASET_PATH =
        "src/main/resources/datasets/your_dataset.csv";
```

---

### 2. Change the number of input features

The spam example contains five features:

```java
private static final int NUM_INPUTS = 5;
```

If another dataset has eight features:

```java
private static final int NUM_INPUTS = 8;
```

The network input layer automatically uses this value:

```java
.addInputLayer(NUM_INPUTS)
```

---

### 3. Define the new target

The current target means:

```text
0 = NOT SPAM
1 = SPAM
```

For another binary problem the same structure could mean:

```text
0 = LEGITIMATE
1 = FRAUD
```

or:

```text
0 = CUSTOMER STAYS
1 = CUSTOMER LEAVES
```

The workflow stays the same; only the meaning of the data changes.

---

### 4. Adapt preprocessing

Min-Max scaling is appropriate for this dataset because the numerical features use different ranges.

Another dataset may require additional preprocessing such as:

```text
missing-value handling
categorical encoding
normalization
feature selection
```

The important rule remains:

> Fit preprocessing using training data only and apply the same preprocessing to future input.

---

### 5. Adapt the network

The current network is:

```text
5 -> 32 -> 16 -> 1
```

Another problem may require a different number of inputs or different hidden-layer sizes.

For example:

```text
10 -> 64 -> 32 -> 1
```

The hidden-layer sizes, learning rate, batch size and number of epochs are hyperparameters and can be adjusted for the new problem.

---

## Binary vs Multi-Class Classification

This example is designed for **binary classification**:

```text
CLASS 0
CLASS 1
```

and therefore uses:

```java
NUM_OUTPUTS = 1
```

with a Sigmoid output.

For a problem with more than two classes, the output configuration must be changed.

For example, a three-class problem would require three outputs and an activation appropriate for multi-class classification.

The general workflow still remains the same:

```text
load
split
preprocess
build
train
evaluate
save
predict
```

---

## Template Checklist

When adapting this example to another classification problem:

- [ ] Replace the dataset
- [ ] Update `DATASET_PATH`
- [ ] Set the correct `NUM_INPUTS`
- [ ] Define the target classes
- [ ] Inspect the new data
- [ ] Choose appropriate preprocessing
- [ ] Split before fitting preprocessing
- [ ] Adjust the network architecture if necessary
- [ ] Adjust training hyperparameters if necessary
- [ ] Train on the training set
- [ ] Evaluate on unseen test data
- [ ] Save the trained model
- [ ] Use the same preprocessing for new input
- [ ] Keep the feature order identical during training and prediction

---

# Summary

This example demonstrates a complete binary classification workflow with Deep Netts:

```text
CSV data
   |
   v
Train/Test split
   |
   v
Min-Max scaling
   |
   v
5 -> 32 -> 16 -> 1
   |
   v
Training
   |
   v
Evaluation
   |
   v
Save model
   |
   v
Prediction
```

The Java code is intentionally compact so that the main machine learning workflow is easy to identify.

The spam problem provides one concrete implementation, while the same structure can be reused as a starting template for other classification problems.
