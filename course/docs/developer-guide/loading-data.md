# Loading Data

Load tabular data with `DataSets.readCsv(...)`. For a CNN, load consistently
sized and labeled images into an `ImageSet` instead.

The tabular CSV recipe assumes that:

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

## Load labeled images for a CNN

The image-classification projects include an `ImageData` helper that reads an
index file, validates each image, resizes it, optionally converts it to
grayscale, and creates the `ExampleImage` objects stored in an `ImageSet`:

```java
import com.deepnetts.examples.image.ImageData;
import deepnetts.data.ImageSet;

int width = 64;
int height = 64;

ImageSet images = ImageData.load(
        "src/main/resources/datasets/duke-logo",
        "index.txt",
        width,
        height,
        false,
        false
);
```

The final two arguments select grayscale conversion and value inversion. Keep
both `false` for ordinary RGB input. Set grayscale to `true` for one-channel
input, and enable inversion only when the dataset requires light and dark values
to be reversed. The resulting CNN input has shape `width × height × 3` for RGB
or `width × height × 1` for grayscale.

The index file maps each relative image path to its label, while `labels.txt`
defines the stable output-class order. Inspect the loaded set before continuing:

```java
System.out.println("Images: " + images.size());
System.out.println("Images by class: " + images.countByClasses());
```

Check that every expected class is present, labels use one consistent spelling,
and class counts are plausible. A typo in a label creates another class rather
than a harmless display difference.

## Verify the tabular result

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

    **An image shape does not match the CNN input**

    Resize and convert every training and prediction image with the same width,
    height, and channel count. The third input-layer dimension is `3` for RGB
    and `1` for grayscale in the current examples.

??? info "See complete examples"
    - <a href="../../examples/regression/sorting-execution-time-prediction/" target="_blank" rel="noopener noreferrer">Simple Linear Regression</a> loads one input and one continuous target.
    - <a href="../../examples/regression/computer-hardware-performance-prediction/" target="_blank" rel="noopener noreferrer">Multiple Linear Regression</a> loads six inputs and one continuous target.
    - <a href="../../examples/classification/sonar-rock-mine-classification/" target="_blank" rel="noopener noreferrer">Logistic Regression</a> loads a headerless CSV with 60 inputs and one binary target.
    - <a href="../../examples/classification/email-spam-detection/" target="_blank" rel="noopener noreferrer">Spam Classification</a> loads five inputs and one binary target.
    - <a href="../../examples/classification/iris-flower-classification/" target="_blank" rel="noopener noreferrer">Multiclass Classification</a> loads four inputs and three one-hot target columns.
    - <a href="../../examples/image-classification/hotdog-nothotdog/" target="_blank" rel="noopener noreferrer">Hot Dog or Not Hot Dog</a> loads labeled images from class directories.
    - <a href="../../examples/classification/credit-card-fraud-detection/" target="_blank" rel="noopener noreferrer">Credit Card Fraud Detection</a> loads 29 transaction features and one binary target.
    - <a href="../../examples/regression/insurance-payment-prediction/" target="_blank" rel="noopener noreferrer">Insurance Payment Prediction</a> loads a headerless two-column CSV.
    - <a href="../../examples/regression/house-price-prediction/" target="_blank" rel="noopener noreferrer">House Price Prediction</a> loads prepared `LSTAT` and `MEDV` columns.
