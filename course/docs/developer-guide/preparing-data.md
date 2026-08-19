# Preparing Data

Prepare data after loading it and before building or training a model. The safe order is:

```text
shuffle -> split -> fit preprocessing on training data -> apply it to test data
```

## Shuffle and split

Use a fixed seed when shuffling so repeated runs create the same ordering:

```java
import deepnetts.data.MLDataItem;
import deepnetts.data.TrainTestSplit;
import javax.visrec.ml.data.DataSet;

dataSet.shuffle(42);

TrainTestSplit split = dataSet.trainTestSplit(0.8);
DataSet<MLDataItem> trainingSet = split.getTrainingSet();
DataSet<MLDataItem> testSet = split.getTestSet();
```

The value `0.8` assigns 80% of the samples to training and reserves 20% for evaluation. Never train on `testSet`.

## Standardize numerical features

Standardization is useful when numerical features have different means and scales:

```java
import deepnetts.data.norm.Standardizer;

Standardizer standardizer = new Standardizer(trainingSet);
standardizer.apply(trainingSet);
standardizer.apply(testSet);
```

Constructing the standardizer from `trainingSet` ensures that the test data does not influence the learned transformation.

## Scale values to a fixed range

The classification examples use Min-Max scaling:

```java
import deepnetts.data.DataSets;
import deepnetts.data.norm.MinMaxScaler;

MinMaxScaler scaler = DataSets.scaleToMinMax(trainingSet);
scaler.apply(testSet);
```

`scaleToMinMax(trainingSet)` fits the scaler and transforms the training set. Apply that same scaler to the test set.

??? danger "Avoid data leakage"
    Do not fit a standardizer or scaler on the complete dataset before splitting. Doing so lets information from the test samples influence training and makes evaluation look more reliable than it is.

    Keep the fitted preprocessing object. Attach it to the trained model before saving so new prediction inputs receive the same transformation.

??? info "See complete examples"
    - [Simple Linear Regression](../examples/regression/linear-regression.md) uses `Standardizer`.
    - [Logistic Regression](../examples/classification/logistic-regression.md) fits `MinMaxScaler` on training data before transforming the test set.
    - [Spam Classification](../examples/classification/spam-classification.md) uses `MinMaxScaler`.
    - [Duke Logo Recognition](../examples/image-classification/duke-logo-recognition.md) resizes images and converts RGB channels to values in `[0, 1]`.
