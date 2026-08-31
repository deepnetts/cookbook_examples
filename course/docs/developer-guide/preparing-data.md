# Preparing Data

Prepare data after loading it and before building or training a model. The safe order is:

<figure class="course-figure">
  <img src="../../assets/course-figures/leakage-safe-preprocessing.svg" alt="Dataset shuffled and split before preprocessing is fitted on training data and applied unchanged to test data">
  <figcaption>Fit preprocessing only from training data, then reuse the fitted transformation for the test set and future samples.</figcaption>
</figure>

## Clean incomplete tabular data before Deep Netts

Deep Netts expects model-ready numerical features and targets. If a raw CSV has
missing cells, invalid sentinel values, duplicated rows, inconsistent types, or
extra columns, clean it with a dataframe tool before calling
`DataSets.readCsv`.

<figure class="course-figure">
  <img src="../../assets/course-figures/tabular-cleaning-pipeline.svg" alt="Raw dataset cleaned with DFLib, exported to CSV, loaded with Deep Netts DataSets, split, and safely preprocessed">
  <figcaption>DFLib handles incomplete tabular data before Deep Netts loads the resulting numerical dataset.</figcaption>
</figure>

Before exporting the model-ready CSV, confirm:

- every required feature and target column exists;
- columns have the expected numerical types and order;
- missing and invalid values have an explicit treatment;
- duplicates are understood and removed only when they are genuinely repeated observations;
- no unhandled missing value reaches the Deep Netts loader.

### Prepare tabular data with DFLib

<a href="https://dflib.org/dflib/docs/2.x/" target="_blank" rel="noopener noreferrer">DFLib</a>
is already used by the Sorting Execution Time example. It can select, rename,
transform, join, drop, and fill columns or rows before exporting model-ready data.

DFLib prepares the raw table. It does not replace Deep Netts
`Standardizer`, `MinMaxScaler`, dataset splitting, training, or evaluation.

### Select columns and handle nulls

The Sorting Execution Time project already uses DFLib to select the feature and
target in their required order. The same pipeline can apply a
domain-defined missing-value rule before exporting a generated CSV:

```java
import org.dflib.DataFrame;
import org.dflib.csv.Csv;

DataFrame modelData = Csv.load(RAW_DATASET_PATH)
        .cols("comparison_count", "execution_time_ms")
        .select()
        .cols("execution_time_ms")
        .fillNulls(0.0);

Csv.saver()
        .createMissingDirs()
        .save(modelData, CLEAN_DATASET_PATH);
```

Use a constant such as `0.0` only when the domain says that it has a real
meaning. Do not use it merely because a cell is empty.

For ordered measurements where carrying a neighboring observation is valid,
DFLib also provides forward and backward filling:

```java
DataFrame modelData = rawData
        .cols("sensor_value")
        .fillNullsForward()
        .cols("target")
        .fillNullsBackwards();
```

Forward or backward filling is appropriate only when row order has a real
temporal or sequential meaning. It is usually wrong for independently sampled
rows.

### Load the cleaned CSV with Deep Netts

After DFLib exports the expected numerical columns, continue with
the normal Deep Netts workflow:

```java
TabularDataSet<MLDataItem> dataSet = DataSets.readCsv(
        CLEAN_DATASET_PATH,
        NUM_INPUTS,
        NUM_OUTPUTS,
        true,
        ",");
```

The selected column order is part of the model contract: input columns come
first and target columns come last.

??? danger "Do not leak information through imputation"
    Schema corrections, selecting columns, mapping a known sentinel value, and
    domain-defined constants can be applied before the train/test split when
    they do not learn anything from the dataset.

    Mean, median, mode, frequency, and other data-derived replacement values
    must be calculated from the **training subset only**. Save those learned
    values and apply them unchanged to the test subset and future prediction
    data. Calculating them from the complete table lets test information affect
    training.

    There is no universally correct missing-value strategy. Choose it from the
    meaning of the column, why values are missing, how much data would be lost,
    and how the model will receive future inputs.

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

For an `ImageSet`, use the corresponding image split:

```java
images.shuffle(42);
ImageSet[] split = images.split(0.8, 0.2);
ImageSet trainingSet = split[0];
ImageSet testSet = split[1];
```

Image width, height, channel order, value scaling, and label mapping are part of
the model input contract. Apply the same fixed transformations to training,
test, and future prediction images. If a transformation learns statistics from
the dataset, fit those statistics on `trainingSet` only. Apply data augmentation
only to training images, after the split.

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
    - [Simple Linear Regression](../examples/regression/sorting-execution-time-prediction.md) uses `Standardizer`.
    - [Logistic Regression](../examples/classification/sonar-rock-mine-classification.md) fits `MinMaxScaler` on training data before transforming the test set.
    - [Spam Classification](../examples/classification/email-spam-detection.md) uses `MinMaxScaler`.
    - [Duke Logo Recognition](../examples/image-classification/duke-logo-recognition.md) resizes images and converts RGB channels to values in `[0, 1]`.
