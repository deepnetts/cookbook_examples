# Model Development

Training a neural network is only one part of Machine Learning. A useful model comes from a complete, repeatable workflow that begins with a clearly defined problem and continues through data preparation, evaluation, deployment, and monitoring.

This lesson explains **why the stages exist and why their order matters**. For focused Java implementation recipes, use the [Developer Guide](../developer-guide/index.md).

```text
Define the problem
        |
        v
Load and understand data
        |
        v
Split before preprocessing
        |
        v
Build and train a suitable model
        |
        v
Evaluate on unseen data
        |
        v
Save the complete pipeline
        |
        v
Predict new samples
```

Changing this order carelessly can produce misleading evaluation results or a model that behaves differently after deployment.

## 1. Define the prediction problem

Begin by stating what the model receives and what it must predict:

```text
Inputs -> model -> target
```

Then identify the task:

- **regression** predicts a continuous numerical value;
- **binary classification** chooses between two classes;
- **multiclass classification** chooses from three or more classes.

This decision determines the dataset structure, output layer, loss function, evaluation metrics, and interpretation of predictions. If the target is unclear, later implementation decisions cannot be evaluated reliably.

## 2. Choose the execution environment

Runtime choices should be explicit and reproducible. The introductory examples use CPU execution because their tabular datasets and networks are small. A more complex environment is useful only when the workload justifies the additional setup and operational cost.

Environment verification belongs in [Getting Started](../getting-started/index.md), before model-development work begins.

## 3. Load and inspect the data

The model can learn only from information represented in the dataset. Before training, confirm:

- where the data came from;
- what one row represents;
- which columns are features and targets;
- whether values are missing or invalid;
- whether rows are duplicated or ordered;
- whether classes are balanced;
- whether feature units and ranges make sense.

A program can execute successfully while learning the wrong relationship if the dataset is misunderstood.

```java
TabularDataSet<MLDataItem> dataSet =
        DataSets.readCsv(
                DATASET_PATH,
                NUM_INPUTS,
                NUM_OUTPUTS,
                true,
                ","
        );

System.out.println("Samples: " + dataSet.size());
System.out.println(
        "Columns: " + Arrays.toString(dataSet.getColumnNames())
);
```

## 4. Separate training and evaluation data

Training and test data have different responsibilities:

| Dataset | Purpose |
|---|---|
| Training set | Learn model parameters and preprocessing values |
| Test set | Estimate behavior on unseen samples |

Shuffle when row order could bias the split, and use a fixed seed when comparing experiments. Do not train on the test set or repeatedly tune decisions against the final test result.

```java
dataSet.shuffle(42);

TrainTestSplit split = dataSet.trainTestSplit(0.8);
DataSet<MLDataItem> trainingSet = split.getTrainingSet();
DataSet<MLDataItem> testSet = split.getTestSet();
```

## 5. Fit preprocessing without leakage

Split the dataset before fitting preprocessing:

```text
Complete dataset
        |
        v
Train/test split
        |
        v
Fit preprocessing on TRAIN only
        |
        +------------------+
        |                  |
        v                  v
Transform train      Transform test
```

Fitting preprocessing on the complete dataset lets test information influence training. This is **data leakage**, and it can make evaluation results look better than they should.

```java
Standardizer standardizer = new Standardizer(trainingSet);
standardizer.apply(trainingSet);
standardizer.apply(testSet);
```

## 6. Choose the smallest suitable model

Architecture should match the prediction problem rather than being complex by default:

- a linear regression model may need no hidden layers;
- a nonlinear binary classifier may benefit from hidden layers and one probability output;
- a multiclass classifier needs one output per class.

Start with a model that is easy to explain and evaluate. Add complexity only when evidence shows that the simpler model is insufficient.

```java
FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
        .addInputLayer(NUM_INPUTS)
        .addFullyConnectedLayer(16, ActivationType.TANH)
        .addOutputLayer(NUM_OUTPUTS, ActivationType.SOFTMAX)
        .lossFunction(LossType.CROSS_ENTROPY)
        .randomSeed(42)
        .build();
```

## 7. Match output, activation, and loss

The output layer must represent the target correctly:

| Task | Typical output | Typical loss |
|---|---|---|
| Regression | Linear value | Mean Squared Error |
| Binary classification | Sigmoid probability | Cross-Entropy |
| Multiclass classification | Softmax probabilities | Cross-Entropy |

The activation constrains what the model can output. The loss measures how different that output is from the known target and supplies the training signal.

## 8. Configure and run training

Training choices include the learning rate, optimizer, epoch limit, batch size, sample shuffling, and stopping conditions. These values are hyperparameters selected by the developer rather than learned as weights.

The goal is not merely to reduce training loss. The model must learn patterns that remain useful on unseen data. Change one major decision at a time and record the configuration so experiments can be compared.

```java
neuralNet.getTrainer()
        .setStopEpochs(350)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.ADAM)
        .setShuffle(true);

neuralNet.train(trainingSet);
```

## 9. Evaluate on unseen data

Evaluation should answer whether the model is useful for the real prediction problem, not only whether training completed.

Regression commonly examines MAE, RMSE, and R². Classification may examine accuracy, precision, recall, F1, and a confusion matrix. No metric is universally best: the correct choice depends on the target, class balance, baseline performance, and cost of different errors.

Unexpectedly strong results should trigger checks for leakage, duplicates, an unrepresentative split, or target information hidden among the features.

```java
ClassificationMetrics metrics =
        (ClassificationMetrics) neuralNet.test(testSet);

System.out.println(metrics);
```

## 10. Save the complete prediction pipeline

A trained network expects data transformed exactly as its training inputs were transformed. Treat the model, fitted preprocessing, feature order, class mapping, and relevant metadata as one versioned pipeline.

Saving only learned weights while forgetting preprocessing creates inconsistent predictions after deployment.

```java
neuralNet.setNormalizer(standardizer);
Files.createDirectories(Path.of("models"));
neuralNet.save(MODEL_PATH);
```

## 11. Predict new samples safely

Every prediction input must follow the training contract:

- same number of features;
- same meaning, units, and order;
- same preprocessing;
- valid and finite values;
- same class mapping for categorical outputs.

Regression returns a quantity, binary classification usually applies a threshold to a probability, and multiclass classification selects among class probabilities. The application must interpret those outputs explicitly.

```java
float[] probabilities = neuralNet.predict(input);

int predictedClass = 0;
for (int i = 1; i < probabilities.length; i++) {
    if (probabilities[i] > probabilities[predictedClass]) {
        predictedClass = i;
    }
}
```

## Keep experiments reproducible

Fixed random seeds help compare runs, but reproducibility also requires recording:

- dataset and code versions;
- feature and target definitions;
- split strategy;
- preprocessing decisions;
- model architecture and hyperparameters;
- evaluation metrics;
- dependency and runtime versions;
- saved model version.

Without this context, it is difficult to know whether a result changed because of an intentional improvement or because the experiment started differently.

## Workflow checklist

Before considering an experiment complete, verify that you have:

- [ ] defined the target and task type;
- [ ] understood and inspected the dataset;
- [ ] separated training and test data;
- [ ] fitted preprocessing on training data only;
- [ ] selected an appropriate architecture;
- [ ] matched the output activation and loss to the task;
- [ ] recorded the training configuration;
- [ ] evaluated on unseen data with relevant metrics;
- [ ] saved preprocessing with the model;
- [ ] preserved the prediction input contract.

Model development is a pipeline. Every stage contributes to whether the final prediction can be trusted.

## Continue learning

- Use the [Developer Guide](../developer-guide/index.md) when implementing an individual step.
- Choose an [Example](../examples/index.md) to see the complete workflow in context.
- Compare [Hot Dog](../examples/image-classification/hotdog-nothotdog.md), [Duke](../examples/image-classification/duke-logo-recognition.md), and [Parking Occupancy](../examples/image-classification/parking-lot-occupancy.md) to see the same workflow applied to image data.
- Open [Running the Examples](../examples/running-examples.md) to compile and execute a Maven project.
