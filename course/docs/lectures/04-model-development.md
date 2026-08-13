# Model Development

Training a neural network is only one part of Machine Learning. A useful model comes from a complete, repeatable workflow that starts with a clearly defined problem and continues through data preparation, evaluation, saving, and prediction.

The introductory Deep Netts examples follow this sequence:

```text
Configure runtime
       |
       v
Load and inspect data
       |
       v
Shuffle and split
       |
       v
Fit preprocessing on training data
       |
       v
Build and configure the model
       |
       v
Train
       |
       v
Evaluate on test data
       |
       v
Save model and preprocessing
       |
       v
Predict new samples
```

The order matters. Changing it carelessly can produce misleading evaluation results or a model that behaves differently in production.

## 1. Define the prediction problem

Begin by stating exactly what the model should predict.

For computer hardware performance:

```text
Input:  six hardware characteristics
Target: PRP, a continuous numerical value
Task:   regression
```

For email spam detection:

```text
Input:  five email characteristics
Target: is_spam, either 0 or 1
Task:   binary classification
```

This decision influences the dataset structure, output layer, loss function, and evaluation metrics.

## 2. Configure the runtime

Runtime choices should be explicit and reproducible. The examples use CPU execution:

```java
DeepNetts.getInstance().setUseCuda(false);
```

Small tabular datasets and compact networks do not require GPU acceleration. Starting with the simplest suitable environment makes the examples easier to run and debug.

## 3. Load the data

The model can only learn from the information represented in its dataset. Loading is therefore the first point where assumptions should be checked:

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

The program must know:

- where the dataset is located,
- which columns are features,
- which columns are targets,
- whether a header is present,
- which delimiter separates values.

For these examples, all feature columns come before the target column.

## 4. Inspect and understand the data

Before building a model, verify that the dataset matches expectations:

```java
System.out.println("Samples: " + dataSet.size());
System.out.println(
        "Columns: " + Arrays.toString(dataSet.getColumnNames())
);
```

The examples use prepared datasets, so their Java programs perform only basic inspection. In real projects, this stage may also include:

- missing-value checks,
- invalid-value detection,
- duplicate analysis,
- feature distributions,
- target or class distribution,
- outlier analysis,
- categorical encoding decisions.

A model can execute successfully and still learn the wrong thing if the data is misunderstood.

## 5. Shuffle the samples

Rows may be ordered by collection time, class, source, or another hidden pattern. Shuffling reduces the chance that this ordering creates a biased split:

```java
dataSet.shuffle(42);
```

The fixed seed makes the shuffled order reproducible. Reproducibility helps compare model changes because repeated runs begin from the same experimental conditions.

## 6. Create training and test sets

The examples use an 80/20 split:

```java
TrainTestSplit split = dataSet.trainTestSplit(0.8);

DataSet<MLDataItem> trainingSet = split.getTrainingSet();
DataSet<MLDataItem> testSet = split.getTestSet();
```

The two subsets have different responsibilities:

| Dataset | Purpose |
|---|---|
| Training set | Learn weights and biases |
| Test set | Measure behavior on unseen samples |

Evaluating only on training data answers how well the model fits examples it has already seen. It does not reliably answer how well the model generalizes.

## 7. Fit preprocessing on training data

Features often use different numerical scales. Preprocessing can make optimization more stable, but its parameters must be learned without looking at the test set.

Correct order:

```text
Complete dataset
       |
       v
Train/test split
       |
       v
Fit preprocessing on TRAIN only
       |
       +-----------------+
       |                 |
       v                 v
Transform train     Transform test
```

Incorrect order:

```text
Complete dataset
       |
       v
Fit preprocessing
       |
       v
Train/test split
```

The incorrect order allows information from the test set to influence preprocessing. This is **data leakage**, and it can make evaluation results look better than they should.

The regression example uses standardization:

```java
Standardizer standardizer = new Standardizer(trainingSet);

standardizer.apply(trainingSet);
standardizer.apply(testSet);
```

The classification example fits a Min-Max scaler on the training set and then applies it to the test set.

## 8. Choose the smallest suitable model

Architecture should match the problem rather than being complex by default.

The regression example uses:

```text
6 -> 1
```

This is sufficient for multiple linear regression because it has no hidden layers and uses a linear output.

The spam classifier uses:

```text
5 -> 32 -> 16 -> 1
```

Its hidden layers can learn non-linear relationships, while the Sigmoid output is appropriate for binary classification.

Start with a model that is easy to explain and evaluate. Add complexity only when results show that the simpler model is insufficient.

## 9. Match activation and loss to the task

The model must optimize an objective that represents the prediction problem:

| Task | Output activation | Loss |
|---|---|---|
| Regression | Linear | Mean Squared Error |
| Binary classification | Sigmoid | Cross-Entropy |

A linear output can predict unrestricted numerical values. A Sigmoid output produces a value between `0` and `1`, suitable for a binary probability.

The loss function supplies the training signal: it measures how different the prediction is from the known target.

## 10. Configure training

Training configuration controls how the model learns:

```java
neuralNet.getTrainer()
        .setStopEpochs(50)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.SGD)
        .setShuffle(true);
```

Important choices include:

- **epochs** — how many times training may process the dataset,
- **learning rate** — how large each parameter update is,
- **optimizer** — how weights and biases are updated,
- **batch size** — how many samples contribute to one update,
- **shuffle** — whether sample order changes between epochs.

These values are hyperparameters. They are selected by the developer rather than learned as model weights.

## 11. Train the model

Training begins with:

```java
neuralNet.train(trainingSet);
```

Internally, the process repeatedly performs:

```text
forward propagation
        |
        v
loss calculation
        |
        v
backpropagation
        |
        v
parameter update
```

The goal is not merely to reduce training loss. The real goal is to learn patterns that remain useful for unseen data.

## 12. Evaluate on unseen data

After training, evaluate with the test set:

```java
RegressionMetrics metrics =
        (RegressionMetrics) neuralNet.test(testSet);
```

or:

```java
ClassificationMetrics metrics =
        (ClassificationMetrics) neuralNet.test(testSet);
```

Regression metrics answer questions about numerical prediction error. Classification metrics answer questions about correct and incorrect class decisions.

Useful regression metrics include:

- Mean Squared Error,
- Root Mean Squared Error,
- Mean Absolute Error,
- R-squared.

Useful classification metrics include:

- accuracy,
- precision,
- recall,
- F1 score,
- confusion matrix.

No single metric is best for every problem. The appropriate metric depends on the consequences of different kinds of errors.

## 13. Save the complete prediction pipeline

The trained network expects input transformed in the same way as its training data. The preprocessing object is attached before saving:

```java
neuralNet.setNormalizer(standardizer);
neuralNet.save(MODEL_PATH);
```

Saving only learned weights while forgetting preprocessing would create inconsistent predictions later. The deployed model and its preprocessing should be treated as one pipeline.

## 14. Predict new samples

New input must follow the same contract as the training data:

- same number of features,
- same feature meaning,
- same feature order,
- same preprocessing.

Prediction uses:

```java
float prediction = neuralNet.predict(input)[0];
```

For regression, this value is the predicted quantity. For binary classification, it is a probability that can be converted into a class with a threshold.

## Keep experiments reproducible

The examples use fixed random seeds for data shuffling and network initialization. They also keep configuration values visible in the Java program.

Reproducibility makes it easier to answer:

```text
Did the model improve because of my change,
or because this run started differently?
```

In a larger project, reproducibility also includes tracking dataset versions, preprocessing decisions, dependencies, hyperparameters, metrics, and saved model versions.

## Separate learning, building, and running

This course uses three complementary levels:

```text
MkDocs Course       -> understand the concepts
Learn Through Code  -> build the program progressively
Complete examples   -> run the standalone Maven project
```

The course explains why each workflow step exists. Code-focused walkthroughs will later show how the program grows step by step. The projects under `examples/` remain the source of truth for complete runnable implementations.

## Workflow checklist

Before considering an introductory model-development experiment complete, verify that you have:

- [ ] defined the prediction target,
- [ ] identified regression or classification,
- [ ] loaded and inspected the dataset,
- [ ] shuffled reproducibly,
- [ ] separated training and test data,
- [ ] fitted preprocessing on training data only,
- [ ] selected an appropriate architecture,
- [ ] matched the output activation and loss to the task,
- [ ] configured and trained the model,
- [ ] evaluated on unseen test data,
- [ ] saved preprocessing with the model,
- [ ] preserved feature order for prediction.

Model development is a pipeline. Every stage contributes to whether the final prediction can be trusted.

## Run the complete workflows

The standalone projects apply the checklist from this lesson from data loading through prediction:

- [Run the Computer Hardware Performance — Multiple Linear Regression workflow](https://github.com/deepnetts/cookbook-examples/tree/main/examples/multiple-linear-regression)
- [Run the Email Spam Classification workflow](https://github.com/deepnetts/cookbook-examples/tree/main/examples/spam-classification)

Use their READMEs to review the dataset, commands, model configuration, metrics, and expected program flow before adapting either project to a new problem.

## Continue learning

You have completed the introductory course path. Use the glossary to review terminology while exploring and adapting the runnable examples.
