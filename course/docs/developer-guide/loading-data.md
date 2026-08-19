# Loading Data

Use `DataSets.readCsv(...)` to load a prepared numerical CSV dataset into the tabular data structure consumed by Deep Netts models.

This recipe assumes that:

- every data row represents one sample;
- input columns come first;
- target columns come last;
- values use a consistent delimiter;
- the data is already numerical.

## CSV structure

For a regression task with two inputs and one target, organize the file like this:

```text
feature_1,feature_2,target
12.5,3.2,48.1
10.0,4.7,45.6
```

`NUM_INPUTS = 2` tells Deep Netts to use the first two columns as model inputs. `NUM_OUTPUTS = 1` makes the final column the prediction target.

## Load the dataset

Add the required imports and describe the expected schema:

```java
import deepnetts.data.DataSets;
import deepnetts.data.MLDataItem;
import deepnetts.data.TabularDataSet;

private static final String DATASET_PATH =
        "src/main/resources/datasets/data.csv";
private static final int NUM_INPUTS = 2;
private static final int NUM_OUTPUTS = 1;
```

Load the CSV:

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

The arguments are:

| Argument | Purpose |
|---|---|
| `DATASET_PATH` | Path to the CSV file |
| `NUM_INPUTS` | Number of feature columns at the start of each row |
| `NUM_OUTPUTS` | Number of target columns at the end of each row |
| `true` | Indicates that the first row contains column names |
| `","` | Delimiter used between values |

Use `false` instead of `true` when the file does not contain a header. Change the final argument when the file uses another delimiter, such as `";"`.

## Verify the result

Do not continue directly to training. First confirm that Deep Netts loaded the expected number of samples and columns:

```java
import java.util.Arrays;

System.out.println("Samples: " + dataSet.size());
System.out.println(
        "Columns: " + Arrays.toString(dataSet.getColumnNames())
);
```

Compare this output with the CSV file you intended to load. This small check catches incorrect paths, unexpected headers, and schema mistakes early.

??? warning "Common problems"
    **The file cannot be found**

    A relative path is resolved from the process working directory, which may differ between a terminal and an IDE. Run the program from the Maven project directory or configure the IDE working directory explicitly.

    **Inputs and targets are reversed**

    `readCsv(...)` expects the input columns first and the target columns last. Reorder a prepared CSV before loading it if its target appears elsewhere.

    **The column count is wrong**

    `NUM_INPUTS + NUM_OUTPUTS` must match the number of columns in each data row. For multiclass classification, `NUM_OUTPUTS` is commonly greater than one because every class has its own target column.

    **Values cannot be parsed**

    Check that the delimiter argument matches the file and that the data rows contain numerical values. Encode or otherwise prepare categorical values before using this recipe.

## See complete examples

- [Simple Linear Regression](../examples/regression/linear-regression.md) loads one input and one continuous target.
- [Multiple Linear Regression](../examples/regression/multiple-linear-regression.md) loads six inputs and one continuous target.
- [Logistic Regression](../examples/classification/logistic-regression.md) loads a headerless CSV with 60 inputs and one binary target.
- [Spam Classification](../examples/classification/spam-classification.md) loads five inputs and one binary target.
- [Multiclass Classification](../examples/classification/multiclass-classification.md) loads four inputs and three one-hot target columns.
