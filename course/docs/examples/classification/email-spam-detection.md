<a class="github-example-button" href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/classification/email-spam-detection"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.64 0 8.13c0 3.59 2.29 6.64 5.47 7.71.4.08.55-.18.55-.39 0-.19-.01-.83-.01-1.51-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.21-3.64-.9-3.64-4.01 0-.89.31-1.62.82-2.19-.08-.21-.36-1.04.08-2.16 0 0 .67-.22 2.2.84A7.5 7.5 0 0 1 8 3.92a7.5 7.5 0 0 1 2 .27c1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.95.08 2.16.51.57.82 1.3.82 2.19 0 3.12-1.87 3.8-3.65 4.01.29.25.54.74.54 1.5 0 1.08-.01 1.95-.01 2.22 0 .21.15.47.55.39A8.16 8.16 0 0 0 16 8.13C16 3.64 12.42 0 8 0Z"></path></svg><span>View Example on GitHub</span></a>

# Email Spam Detection

This walkthrough builds an email spam detector one part at a time. It demonstrates binary classification: predicting which of two classes an input belongs to.

**Problem:** Classify an email as `SPAM` or `NOT SPAM` from five numerical features.

**Dataset:** Prepared email records containing message and sender characteristics plus a binary target.

## At a glance

| | |
|---|---|
| **ML task** | Binary classification |
| **Level** | Beginner |
| **Dataset** | 20,000 prepared email records |
| **Inputs** | Five numerical email and sender features |
| **Target** | `is_spam` — `0` for not spam, `1` for spam |
| **Model** | `5 -> 32 -> 16 -> 1` feed-forward neural network with a Sigmoid output |
| **Related concepts** | [Machine Learning Basics](../../lectures/01-ml-basics.md), [Neural Networks](../../lectures/02-neural-networks.md), [Model Development](../../lectures/04-model-development.md) |

The model receives five email features:

```text
num_links, num_words, has_offer, sender_score, all_caps
```

and predicts one binary target:

```text
is_spam - 0 for NOT SPAM, 1 for SPAM
```

The complete flow is:

```text
load -> inspect -> split -> scale -> build -> train -> evaluate -> save -> predict
```


## 1. Define the program configuration

Start with the dataset path, model path, and expected data shape:

```java
private static final String DATASET_PATH =
        "src/main/resources/datasets/spam_detection_dataset.csv";

private static final String MODEL_PATH =
        "models/spam-classifier.dnet";

private static final int NUM_INPUTS = 5;
private static final int NUM_OUTPUTS = 1;
```

Five input columns describe each email. One output represents the probability that the email belongs to the spam class.

## 2. Select CPU execution

Disable CUDA at the start of the program:

```java
DeepNetts.getInstance().setUseCuda(false);
```

The dataset and network are small enough for CPU execution. This keeps the example easy to run without requiring GPU configuration.

## 3. Load the labeled emails

Read the CSV dataset:

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

The first five columns are features and the final `is_spam` column is the known target. These labels make this a supervised learning problem.

## 4. Inspect the dataset

Print basic structural information:

```java
System.out.println("Samples: " + dataSet.size());
System.out.println(
        "Columns: " + Arrays.toString(dataSet.getColumnNames())
);
```

This confirms that the CSV was found and parsed. The expected columns are the five email features followed by `is_spam`.

## 5. Shuffle and split the samples

Shuffle with a fixed seed and create training and test sets:

```java
dataSet.shuffle(42);

TrainTestSplit split = dataSet.trainTestSplit(0.8);

DataSet<MLDataItem> trainingSet = split.getTrainingSet();
DataSet<MLDataItem> testSet = split.getTestSet();
```

The network learns from 80% of the samples. The remaining 20% measures how it handles emails that were not used to update its parameters.

## 6. Scale the features

Fit Min-Max scaling on the training set, then transform the test set with the same scaler:

```java
MinMaxScaler scaler = DataSets.scaleToMinMax(trainingSet);

scaler.apply(testSet);
```

The features use different numerical ranges. Scaling prevents a large-valued feature such as `num_words` from dominating only because of its magnitude. The scaler must be fitted before touching the test data to avoid leakage.

## 7. Build the classification network

Create the feed-forward architecture:

```java
FeedForwardNetwork neuralNet =
        FeedForwardNetwork.builder()
                .addInputLayer(NUM_INPUTS)
                .addFullyConnectedLayer(32)
                .addFullyConnectedLayer(16)
                .addOutputLayer(NUM_OUTPUTS, ActivationType.SIGMOID)
                .lossFunction(LossType.CROSS_ENTROPY)
                .randomSeed(42)
                .build();
```

The architecture is:

```text
5 -> 32 -> 16 -> 1
```

The hidden layers use ReLU by default and learn non-linear feature combinations. The Sigmoid output produces a value between `0` and `1`, while Cross-Entropy supplies the classification training objective.

## 8. Configure mini-batch training

Set the main hyperparameters and train:

```java
neuralNet.getTrainer()
        .setStopEpochs(50)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.SGD)
        .setBatchMode(true)
        .setBatchSize(64)
        .setShuffle(true);

neuralNet.train(trainingSet);
```

Mini-batch mode updates the model using groups of 64 samples. Each epoch shuffles the data, and SGD adjusts the weights and biases to reduce classification loss.

## 9. Evaluate the classifier

Test the trained network on unseen samples:

```java
ClassificationMetrics metrics =
        (ClassificationMetrics) neuralNet.test(testSet);

System.out.println(metrics);
```

Classification metrics can report more than overall accuracy. Precision, recall, F1 score, and the confusion matrix help explain which kinds of classification errors the model makes.

## 10. Save the model and scaler

Attach preprocessing before saving the trained network:

```java
neuralNet.setNormalizer(scaler);

Files.createDirectories(Path.of("models"));
neuralNet.save(MODEL_PATH);
```

New emails must be scaled exactly like the training samples. Saving the scaler with the model keeps that rule inside the reusable prediction pipeline.

## 11. Describe a new email

Create an input array in the same order as the dataset columns:

```java
float[] email = {
        4,     // num_links
        55,    // num_words
        1,     // has_offer
        0.35f, // sender_score
        1      // all_caps
};
```

Each number describes one email characteristic. A correct array length is not enough-the feature order must also match training.

## 12. Predict probability and class

Read the Sigmoid output:

```java
float spamProbability = neuralNet.predict(email)[0];

System.out.printf("Spam probability: %.4f%n", spamProbability);
```

Convert the probability into a class with a `0.5` threshold:

```java
System.out.println(
        spamProbability >= 0.5f ? "SPAM" : "NOT SPAM"
);
```

The probability preserves the model's confidence, while the threshold produces the final binary decision.

## What you built

You assembled a complete binary-classification pipeline:

```text
Labeled email CSV
        |
        v
80/20 train/test split
        |
        v
Min-Max scaling
        |
        v
5 -> 32 -> 16 -> 1 network
        |
        v
Training and classification evaluation
        |
        v
Saved model and email classification
```

<div class="github-project-action">
<a class="github-example-button" href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/classification/email-spam-detection"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.64 0 8.13c0 3.59 2.29 6.64 5.47 7.71.4.08.55-.18.55-.39 0-.19-.01-.83-.01-1.51-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.21-3.64-.9-3.64-4.01 0-.89.31-1.62.82-2.19-.08-.21-.36-1.04.08-2.16 0 0 .67-.22 2.2.84A7.5 7.5 0 0 1 8 3.92a7.5 7.5 0 0 1 2 .27c1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.95.08 2.16.51.57.82 1.3.82 2.19 0 3.12-1.87 3.8-3.65 4.01.29.25.54.74.54 1.5 0 1.08-.01 1.95-.01 2.22 0 .21.15.47.55.39A8.16 8.16 0 0 0 16 8.13C16 3.64 12.42 0 8 0Z"></path></svg><span>View Example on GitHub</span></a>
</div>

<a class="back-button" href="../../">← Back to Examples</a>
