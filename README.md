# Deep Netts Cookbook Examples

Complete, runnable Machine Learning examples for Java developers using [Deep Netts](https://www.deepnetts.com/).

This repository combines a guided course with 15 standalone Maven projects. The examples cover regression, binary and multiclass classification, convolutional neural networks, and TensorFlow model import. Each project includes its source code, dataset or sample assets, Maven configuration, and a detailed README.

## Start here

The projects require:

- Java 25;
- Maven;
- Deep Netts 4 Pro and a valid license installed in the local Maven repository;
- the Java Vector API enabled at runtime.

Follow the [Getting Started guide](course/docs/getting-started/index.md) to install the prerequisites, then verify the setup with the smallest example:

```bash
git clone https://github.com/deepnetts/cookbook-examples.git
cd cookbook-examples/examples/hello-world
MAVEN_OPTS="--add-modules jdk.incubator.vector" mvn clean compile exec:java
```

A successful run ends with `SUCCESS: Deep Netts is installed and configured correctly.`

## Example catalog

All examples are independent Maven projects. Run commands from the selected project's directory because datasets and generated models use project-relative paths.

### Setup check

| Example | What it demonstrates |
| --- | --- |
| [Hello World](examples/hello-world/) | Creates a minimal network and verifies Java, Maven, Deep Netts, licensing, and Vector API configuration. |

### Regression

| Example | Model and result |
| --- | --- |
| [Sorting Execution Time](examples/regression/sorting-execution-time-prediction/) | Simple linear regression that predicts execution time from the comparison count. |
| [Insurance Payment](examples/regression/insurance-payment-prediction/) | Simple linear regression that predicts total insurance payments from the number of claims. |
| [Computer Hardware Performance](examples/regression/computer-hardware-performance-prediction/) | Multiple linear regression that predicts relative CPU performance from six hardware features. |
| [House Price](examples/regression/house-price-prediction/) | Feed-forward regression that predicts normalized house value from the `LSTAT` feature. |

### Classification

| Example | Model and result |
| --- | --- |
| [Sonar Rock or Mine](examples/classification/sonar-rock-mine-classification/) | Logistic regression that classifies sonar signals as rock or mine. |
| [Email Spam Detection](examples/classification/email-spam-detection/) | Binary feed-forward network that predicts whether an email is spam. |
| [Credit Card Fraud Detection](examples/classification/credit-card-fraud-detection/) | Binary feed-forward network that identifies fraudulent transactions. |
| [Iris Flower Classification](examples/classification/iris-flower-classification/) | Multiclass network with Softmax output that predicts one of three Iris species. |

### Image classification

| Example | Model and result |
| --- | --- |
| [Hot Dog or Not Hot Dog](examples/img-classification/hotdog-nothotdog/) | Binary CNN that detects hot dogs in images. |
| [Duke Logo Recognition](examples/img-classification/duke-logo-recognition/) | Binary CNN that recognizes the Java Duke logo. |
| [Parking Lot Occupancy](examples/img-classification/parking-lot-occupancy/) | Binary CNN that classifies parking spaces as occupied or free. |
| [Handwritten Digit Recognition](examples/img-classification/handwritten-digit-recognition/) | Multiclass CNN that recognizes MNIST digits from 0 to 9. |
| [Lego Figure Recognition](examples/img-classification/lego-figure-recognition/) | Binary CNN that detects Lego figures. |
| [TensorFlow VGGNet16 Import](examples/img-classification/tensorflow-vggnet16-import/) | Imports TensorFlow/ImageNet weights and runs VGGNet16 inference. |

[NLP examples](examples/nlp/) are planned but not yet available.

## Run an example

Choose a project, open its directory, and run its configured main class:

```bash
cd examples/classification/iris-flower-classification
MAVEN_OPTS="--add-modules jdk.incubator.vector" mvn clean compile exec:java
```

On Windows Command Prompt:

```bat
set MAVEN_OPTS=--add-modules jdk.incubator.vector
mvn clean compile exec:java
```

On Windows PowerShell:

```powershell
$env:MAVEN_OPTS="--add-modules jdk.incubator.vector"
mvn clean compile exec:java
```

Most training examples follow the same end-to-end workflow:

```text
load -> inspect -> split -> preprocess -> build -> train -> evaluate -> save -> predict
```

Trained `.dnet` files are written to the example's local `models/` directory. A later run may replace an existing generated model.

### Image example smoke tests

CNN training takes longer than the tabular examples. To verify the full workflow with one epoch, add `-Ddeepnetts.epochs=1`:

```bash
MAVEN_OPTS="--add-modules jdk.incubator.vector" \
  mvn -Ddeepnetts.epochs=1 clean compile exec:java
```

One epoch is a functional check, not a meaningful accuracy benchmark. The VGGNet16 project performs import and inference instead of training; it requires a larger heap and downloads approximately 600 MB of weights on its first run. See its [project README](examples/img-classification/tensorflow-vggnet16-import/) for the exact command.

### Run from an IDE

Import the selected directory as a Maven project, keep that project directory as the working directory, and add this VM option:

```text
--add-modules=jdk.incubator.vector
```

## Course and documentation

The MkDocs course in [`course/`](course/) explains the concepts used by the runnable projects:

- installation and environment verification;
- Machine Learning and neural-network fundamentals;
- the Deep Netts model-development workflow;
- regression, classification, and image-classification walkthroughs;
- the developer guide, JSR 381 overview, and glossary.

To preview it locally:

```bash
cd course
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve -a 127.0.0.1:8002
```

Then open <http://127.0.0.1:8002>.

## Repository structure

```text
cookbook-examples/
├── course/                       # MkDocs course and developer guide
│   ├── docs/
│   │   ├── getting-started/
│   │   ├── examples/
│   │   ├── developer-guide/
│   │   ├── lectures/
│   │   └── glossary.md
│   └── mkdocs.yml
└── examples/
    ├── hello-world/              # Environment verification
    ├── regression/               # Four tabular regression projects
    ├── classification/           # Four tabular classification projects
    ├── img-classification/       # Six CNN/import projects
    └── nlp/                      # Placeholder for future NLP projects
```

## Troubleshooting

If a project does not start, verify that:

- `mvn --version` reports Java 25;
- `MAVEN_OPTS` includes `--add-modules jdk.incubator.vector`;
- the Deep Netts Pro and license artifacts are available to Maven;
- the command is running from the selected example directory;
- the bundled dataset exists under `src/main/resources/datasets/`.

For project-specific datasets, architectures, output, and runtime options, open the README linked in the catalog above. For API details, see the [Deep Netts API documentation](https://www.deepnetts.com/apidocs/index.html).
