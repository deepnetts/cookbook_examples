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
  <img src="../../assets/course-figures/tabular-cleaning-pipeline.svg" alt="Raw dataset cleaned with DFLib or Tablesaw, exported to CSV, loaded with Deep Netts DataSets, split, and safely preprocessed">
  <figcaption>DFLib or Tablesaw handles incomplete tabular data before Deep Netts loads the resulting numerical dataset.</figcaption>
</figure>

Before exporting the model-ready CSV, confirm:

- every required feature and target column exists;
- columns have the expected numerical types and order;
- missing and invalid values have an explicit treatment;
- duplicates are understood and removed only when they are genuinely repeated observations;
- no unhandled missing value reaches the Deep Netts loader.

### Choose an optional dataframe tool

| Tool | Good fit in this cookbook | Useful preparation operations |
|---|---|---|
| <a href="https://dflib.org/dflib/docs/2.x/" target="_blank" rel="noopener noreferrer">DFLib</a> | Already used by the Sorting Execution Time example | Select, rename, transform, join, drop, and fill columns or rows |
| <a href="https://jtablesaw.github.io/tablesaw/userguide/" target="_blank" rel="noopener noreferrer">Tablesaw</a> | Optional Java dataframe alternative | CSV import, typed columns, missing-value selections, filtering, summaries, and export |

These tools prepare the raw table. They do not replace Deep Netts
`Standardizer`, `MinMaxScaler`, dataset splitting, training, or evaluation.

### Prepare columns and nulls with DFLib

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

### Detect and handle missing values with Tablesaw

Tablesaw represents data with typed columns. You can create a selection of
missing values and apply a domain-defined replacement:

```java
import tech.tablesaw.api.DoubleColumn;
import tech.tablesaw.api.Table;

Table modelData = Table.read().csv(RAW_DATASET_PATH);
DoubleColumn payment = modelData.doubleColumn("payment");

payment.set(payment.isMissing(), 0.0);
modelData.write().csv(CLEAN_DATASET_PATH);
```

If incomplete rows cannot be used safely, create a complete-row table instead:

```java
Table completeRows = modelData.dropRowsWithMissingValues();
completeRows.write().csv(CLEAN_DATASET_PATH);
```

Dropping rows reduces the amount of training data and can introduce bias when
missingness is systematic. Record how many rows were removed and inspect which
groups or target values were affected.

### Load the cleaned CSV with Deep Netts

After DFLib or Tablesaw exports the expected numerical columns, continue with
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
