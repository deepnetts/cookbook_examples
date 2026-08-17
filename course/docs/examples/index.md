# Examples

Choose a complete project by the type of Machine Learning problem you want to solve. Each example page explains the problem, dataset, important development steps, and relevant Deep Netts API before linking to the runnable Maven project on GitHub.

If you have not run Deep Netts yet, complete [Hello World](../getting-started/hello-world.md) first. Hello World verifies the installation; the projects below demonstrate complete model-development workflows.

## Choose an example

| Example | ML task | Inputs | Prediction | Start here when you want to learn |
|---|---|---:|---|---|
| [Simple Linear Regression](regression/linear-regression.md) | Regression | 1 | Sorting execution time | The smallest complete regression workflow |
| [Multiple Linear Regression](regression/multiple-linear-regression.md) | Regression | 6 | Computer performance | How several features contribute to one value |
| [Spam Classification](classification/spam-classification.md) | Binary classification | 5 | `SPAM` or `NOT SPAM` | Probabilities, thresholds, and two-class decisions |
| [Multiclass Classification](classification/multiclass-classification.md) | Multiclass classification | 4 | One of three Iris species | One-hot targets, Softmax, and class selection |

If this is your first complete Machine Learning project, start with Simple Linear Regression. It uses one input and one output while still demonstrating data preparation, training, evaluation, model saving, and prediction.

## Regression

Regression predicts a continuous numerical value, such as execution time or computer performance.

### Simple Linear Regression

**Problem:** Predict sorting execution time from the number of comparisons.

**Dataset:** 903 sorting benchmark measurements with one numerical feature and one continuous target.

**You will learn:** How to select a feature and target, split and standardize data, build a `1 -> 1` linear model, evaluate regression metrics, save the model, and make a prediction.

[Explore the walkthrough](regression/linear-regression.md) · [View the complete project on GitHub](https://github.com/deepnetts/cookbook-examples/tree/main/examples/linear-regression)

### Multiple Linear Regression

**Problem:** Predict published relative computer performance from six hardware characteristics.

**Dataset:** 209 computers with six numerical features and the continuous `PRP` target.

**You will learn:** How multiple inputs contribute to one prediction, how to standardize features without data leakage, and how to train and evaluate a linear regression model.

[Explore the walkthrough](regression/multiple-linear-regression.md) · [View the complete project on GitHub](https://github.com/deepnetts/cookbook-examples/tree/main/examples/multiple-linear-regression)

## Classification

Classification predicts a category. A binary classifier chooses between two classes, while a multiclass classifier chooses from three or more classes.

### Spam Classification

**Problem:** Classify an email as `SPAM` or `NOT SPAM` from five numerical features.

**Dataset:** Prepared email records containing message and sender characteristics plus a binary target.

**You will learn:** How to scale features, build a binary feed-forward neural network, interpret a spam probability, evaluate classification metrics, and apply a decision threshold.

[Explore the walkthrough](classification/spam-classification.md) · [View the complete project on GitHub](https://github.com/deepnetts/cookbook-examples/tree/main/examples/spam-classification)

### Multiclass Classification

**Problem:** Identify an Iris flower as Setosa, Versicolor, or Virginica from four measurements.

**Dataset:** 150 flowers with four numerical features and three one-hot encoded target columns.

**You will learn:** How one-hot targets represent classes, how a Softmax output produces class probabilities, and how to select the most probable class.

[Explore the walkthrough](classification/multiclass-classification.md) · [View the complete project on GitHub](https://github.com/deepnetts/cookbook-examples/tree/main/examples/multiclass-classification)

## Running a project

Each GitHub project contains its own Java source, dataset, `pom.xml`, and detailed README. See [Running the Examples](running-examples.md) for the shared compile, runtime, IDE, and troubleshooting instructions.
