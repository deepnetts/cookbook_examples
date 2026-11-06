# Deep Netts Cookbook Examples

Complete, runnable Machine Learning examples for Java developers using [Deep Netts](https://www.deepnetts.com/).

This repository contains 15 standalone Maven projects: a Hello World setup check, regression, binary and multiclass classification, convolutional neural networks, and TensorFlow model import. Each project includes its source code, dataset or sample assets, Maven configuration, and a README with the exact commands to run it. Every example is explained step by step in the [Deep Netts Cookbook](https://www.deepnetts.com/cookbook/examples/).

You do not need to read the Java code to run an example: every command you need is on this page, together with the output you should see and a fix for the most common problems.

## Deep Netts edition

All examples use **Deep Netts Community Edition**, the open core of the Deep Netts platform:

```xml
<dependency>
    <groupId>com.deepnetts</groupId>
    <artifactId>deepnetts-core</artifactId>
    <version>4.0.5</version>
</dependency>
```

- It is published on Maven Central, so Maven downloads it automatically on the first build. No separate installation or extra JVM option is needed.
- It is a pure Java deep learning engine that runs on the CPU. CPU acceleration through the Java Vector API, GPU acceleration through CUDA, and the Visual AI Builder are part of the Free and Enterprise editions, which are a separate download from [deepnetts.com](https://www.deepnetts.com/).
- It is free for learning, research, and building. Its source code and community support are on [GitHub](https://github.com/deepnetts/deepnetts-communityedition).

## 1. Check your environment

You need **Git**, **Java 25 or newer** (a JDK, not only a Java runtime), and **Maven 3.6.3 or newer**. Run each command below in a terminal (PowerShell or Command Prompt on Windows, Terminal on macOS and Linux) and compare the result.

### Git

```bash
git --version
```

You should see a version number, for example:

```text
git version 2.47.1
```

**If it fails** (`git: command not found`, or `'git' is not recognized as an internal or external command`): install Git from [git-scm.com/downloads](https://git-scm.com/downloads), close the terminal, open a new one, and run `git --version` again.

### Java 25 or newer

```bash
java --version
```

```bash
javac --version
```

Both commands must report version 25 or newer, for example:

```text
java 25.0.4.1 2026-08-18 LTS
javac 25.0.4.1
```

OpenJDK builds such as Eclipse Temurin print `openjdk 25...` instead of `java 25...`; that is fine.

**If it fails:**

- **`java` or `javac` is not found, or the version is lower than 25** - download and install JDK 25 from [Oracle](https://www.oracle.com/java/technologies/downloads/) or the free [Eclipse Temurin](https://adoptium.net/temurin/releases/) build. Close the terminal, open a new one, and check again.
- **`java` works but `javac` is not found** - only a Java runtime is installed. Install a JDK from the same links.
- **An older version still appears after installing JDK 25** - point `JAVA_HOME` and `PATH` to the new JDK. The commands below change the current terminal; adjust the folder to where your JDK is installed.

  Windows PowerShell:

  ```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-25"
```

  ```powershell
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
```

  Windows Command Prompt:

  ```bat
set "JAVA_HOME=C:\Program Files\Java\jdk-25"
```

  ```bat
set "PATH=%JAVA_HOME%\bin;%PATH%"
```

  macOS:

  ```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 25)
```

  ```bash
export PATH="$JAVA_HOME/bin:$PATH"
```

  Linux:

  ```bash
export JAVA_HOME=/usr/lib/jvm/jdk-25
```

  ```bash
export PATH="$JAVA_HOME/bin:$PATH"
```

  To make the change permanent on Windows, open **Edit the system environment variables -> Environment Variables**, set `JAVA_HOME` to the JDK folder, and move `%JAVA_HOME%\bin` to the top of `Path`. On macOS and Linux, add the two `export` lines to `~/.zshrc` or `~/.bashrc`.

### Maven

```bash
mvn --version
```

Check two lines: the Maven version must be 3.6.3 or newer, and the `Java version` must be 25 or newer, for example:

```text
Apache Maven 3.9.11
Maven home: C:\Program Files\Apache\Maven\apache-maven-3.9.11
Java version: 25.0.4.1, vendor: Oracle Corporation, runtime: C:\Program Files\Java\jdk-25.0.4.1
```

**If it fails:**

- **`mvn: command not found` or `'mvn' is not recognized as an internal or external command`** - download the binary zip archive from [maven.apache.org/download.cgi](https://maven.apache.org/download.cgi), extract it, and add its `bin` folder to `PATH` as described in the [Maven installation guide](https://maven.apache.org/install.html). Open a new terminal and check again.
- **`Java version` is lower than 25** - Maven uses the JDK from `JAVA_HOME`. Set it as shown in [Java 25 or newer](#java-25-or-newer).
- **`The JAVA_HOME environment variable is not defined correctly`** - `JAVA_HOME` must point to the JDK folder itself (the folder that contains `bin`), not to the `bin` folder.

## 2. Get the examples

```bash
git clone https://github.com/deepnetts/cookbook-examples.git
```

```bash
cd cookbook-examples
```

All commands below start from this `cookbook-examples` folder, the repository root.

**If it fails:**

- **`Filename too long`** (Windows) - some paths in this repository are longer than the default Windows limit. Delete the partially cloned folder, enable long paths in Git, and clone again:

  ```bash
git config --global core.longpaths true
```

  Alternatively, clone into a short folder such as `C:\dev`.
- **`git: command not found`** - see [Git](#git).

## 3. Verify the setup with Hello World

```bash
cd examples/hello-world
```

```bash
mvn clean compile exec:java
```

A successful run ends with:

```text
Java version: 25.0.4.1
Deep Netts prediction for 1.0: 0.34296894
SUCCESS: Deep Netts is installed and configured correctly.
```

The Java version and the prediction can differ on your computer. The first run downloads Deep Netts Community Edition and the Maven plugins (about 10 MB) and can take a minute; later runs take about 10 seconds.

Go back to the repository root:

```bash
cd ../..
```

**If it fails:**

- **`'mvn' is not recognized` or `mvn: command not found`** - Maven is not installed or not on the `PATH`. Follow [Maven](#maven), open a new terminal, and run `mvn --version` again.
- **`release version 25 not supported` or `Java 25 or newer is required`** - Maven runs on an older Java. Install JDK 25 and point `JAVA_HOME` to it, as described in [Java 25 or newer](#java-25-or-newer).
- **`Could not resolve dependencies` or `Could not transfer artifact com.deepnetts:deepnetts-core`** - Maven cannot reach Maven Central. Check the internet connection and any proxy or mirror in `~/.m2/settings.xml`, then force Maven to try again:

```bash
mvn -U clean compile exec:java
```
- **`NoSuchFileException` or `FileNotFoundException` for `src/main/resources/datasets/...`** - the command was not started from the example folder. Go back to the repository root, run the `cd` command from step 1, and run the example again.
- `WARNING: A terminally deprecated method in sun.misc.Unsafe has been called` at the start of a Maven command is printed by Maven itself on Java 24 and newer. It is harmless; ignore it.

## 4. Run the examples

Every example is an independent Maven project. For each one: open its folder with `cd`, run it with `mvn`, and go back to the repository root with `cd ../../..`. The datasets are bundled, and generated models are written to the example's own `models/` folder. If a command fails, see [Troubleshooting](#troubleshooting) or the "If something goes wrong" section of the example README.

The convolutional (image) examples train on the CPU, because Community Edition has no Vector API acceleration. Their default training takes from about 30 seconds (Duke Logo) to about 20 minutes (Handwritten Digit, Lego Figure) on an 8-core CPU. Add `"-Ddeepnetts.epochs=1"` (with the quotes) for a quick one-epoch check.

### Regression

#### Sorting Execution Time

Simple linear regression that predicts execution time from the comparison count. [README](examples/regression/sorting-execution-time-prediction/) - [Explained in the Cookbook](https://www.deepnetts.com/cookbook/examples/regression/sorting-execution-time-prediction/)

```bash
cd examples/regression/sorting-execution-time-prediction
```

```bash
mvn clean compile exec:java
```

Last lines (about 10 seconds):

```text
Samples: 903
Columns: [comparison_count, execution_time_ms]
...
Predicted execution time for 100000 comparisons: 337.74 ms
```

```bash
cd ../../..
```

#### Insurance Payment

Simple linear regression that predicts total insurance payments from the number of claims. [README](examples/regression/insurance-payment-prediction/) - [Explained in the Cookbook](https://www.deepnetts.com/cookbook/examples/regression/insurance-payment-prediction/)

```bash
cd examples/regression/insurance-payment-prediction
```

```bash
mvn clean compile exec:java
```

Last lines (about 5 seconds):

```text
Samples: 63
...
Predicted normalized payment: 0.2446
```

```bash
cd ../../..
```

#### Computer Hardware Performance

Multiple linear regression that predicts relative CPU performance from six hardware features. [README](examples/regression/computer-hardware-performance-prediction/) - [Explained in the Cookbook](https://www.deepnetts.com/cookbook/examples/regression/computer-hardware-performance-prediction/)

```bash
cd examples/regression/computer-hardware-performance-prediction
```

```bash
mvn clean compile exec:java
```

Last lines (about 5 seconds):

```text
Samples: 209
Columns: [MYCT, MMIN, MMAX, CACH, CHMIN, CHMAX, PRP]
...
Predicted relative performance: 404.55
```

```bash
cd ../../..
```

#### House Price

Feed-forward regression that predicts normalized house value from the `LSTAT` feature. [README](examples/regression/house-price-prediction/) - [Explained in the Cookbook](https://www.deepnetts.com/cookbook/examples/regression/house-price-prediction/)

```bash
cd examples/regression/house-price-prediction
```

```bash
mvn clean compile exec:java
```

Last lines (about 5 seconds):

```text
Samples: 506
Columns: [LSTAT, MEDV]
...
Predicted normalized MEDV: 0.6008
```

```bash
cd ../../..
```

### Classification

#### Sonar Rock or Mine

Logistic regression that classifies sonar signals as rock or mine. [README](examples/classification/sonar-rock-mine-classification/) - [Explained in the Cookbook](https://www.deepnetts.com/cookbook/examples/classification/sonar-rock-mine-classification/)

```bash
cd examples/classification/sonar-rock-mine-classification
```

```bash
mvn clean compile exec:java
```

Last lines (about 5 seconds):

```text
Samples: 208
...
Mine probability: 0.8297
Predicted: MINE
Actual: MINE
```

```bash
cd ../../..
```

#### Email Spam Detection

Binary feed-forward network that predicts whether an email is spam. [README](examples/classification/email-spam-detection/) - [Explained in the Cookbook](https://www.deepnetts.com/cookbook/examples/classification/email-spam-detection/)

```bash
cd examples/classification/email-spam-detection
```

```bash
mvn clean compile exec:java
```

Last lines (about 15 seconds):

```text
Samples: 20000
Columns: [num_links, num_words, has_offer, sender_score, all_caps, is_spam]
...
Spam probability: 0.9259
SPAM
```

```bash
cd ../../..
```

#### Credit Card Fraud Detection

Binary feed-forward network that identifies fraudulent transactions. [README](examples/classification/credit-card-fraud-detection/) - [Explained in the Cookbook](https://www.deepnetts.com/cookbook/examples/classification/credit-card-fraud-detection/)

```bash
cd examples/classification/credit-card-fraud-detection
```

```bash
mvn clean compile exec:java
```

Last lines (about 5 seconds):

```text
Samples: 999
...
Fraud probability: 0.9978
FRAUD
```

```bash
cd ../../..
```

#### Iris Flower Classification

Multiclass network with Softmax output that predicts one of three Iris species. [README](examples/classification/iris-flower-classification/) - [Explained in the Cookbook](https://www.deepnetts.com/cookbook/examples/classification/iris-flower-classification/)

```bash
cd examples/classification/iris-flower-classification
```

```bash
mvn clean compile exec:java
```

Last lines (about 5 seconds):

```text
Samples: 150
Columns: [sepal_length, sepal_width, petal_length, petal_width, setosa, versicolor, virginica]
...
Class probabilities: [0.99999917, 8.8696953E-7, 1.34597316E-17]
Predicted species: SETOSA
```

```bash
cd ../../..
```

### Image classification

#### Hot Dog or Not Hot Dog

Binary CNN that detects hot dogs in images. [README](examples/img-classification/hotdog-nothotdog/) - [Explained in the Cookbook](https://www.deepnetts.com/cookbook/examples/image-classification/hotdog-nothotdog/)

```bash
cd examples/img-classification/hotdog-nothotdog
```

Full training (10 epochs, about 1 minute):

```bash
mvn clean compile exec:java
```

Quick one-epoch check (about 20 seconds):

```bash
mvn "-Ddeepnetts.epochs=1" clean compile exec:java
```

Last lines of the one-epoch run:

```text
Images: 467
Images by class: {negative=228, hot_dog=239}
...
Actual: hot_dog
Predicted: hot_dog
Hot-dog probability: 0.6097
```

```bash
cd ../../..
```

#### Duke Logo Recognition

Binary CNN that recognizes the Java Duke logo. [README](examples/img-classification/duke-logo-recognition/) - [Explained in the Cookbook](https://www.deepnetts.com/cookbook/examples/image-classification/duke-logo-recognition/)

```bash
cd examples/img-classification/duke-logo-recognition
```

Full training (20 epochs, about 30 seconds):

```bash
mvn clean compile exec:java
```

Quick one-epoch check (about 10 seconds):

```bash
mvn "-Ddeepnetts.epochs=1" clean compile exec:java
```

Last lines of the one-epoch run:

```text
Images: 103
Images by class: {negative=54, duke=49}
...
Actual: duke
Predicted: duke
Duke probability: 0.7515
```

```bash
cd ../../..
```

#### Parking Lot Occupancy

Binary CNN that classifies parking spaces as occupied or free. [README](examples/img-classification/parking-lot-occupancy/) - [Explained in the Cookbook](https://www.deepnetts.com/cookbook/examples/image-classification/parking-lot-occupancy/)

```bash
cd examples/img-classification/parking-lot-occupancy
```

Full training (3 epochs, about 3 minutes):

```bash
mvn clean compile exec:java
```

Quick one-epoch check (about 2 minutes):

```bash
mvn "-Ddeepnetts.epochs=1" clean compile exec:java
```

Last lines of the one-epoch run:

```text
Images: 6171
Images by class: {negative=2550, busy=3621}
...
Actual: busy
Predicted: busy
Occupied probability: 0.9958
```

```bash
cd ../../..
```

#### Handwritten Digit Recognition

Multiclass CNN that recognizes MNIST digits from 0 to 9. [README](examples/img-classification/handwritten-digit-recognition/) - [Explained in the Cookbook](https://www.deepnetts.com/cookbook/examples/image-classification/handwritten-digit-recognition/)

```bash
cd examples/img-classification/handwritten-digit-recognition
```

Full training (10 epochs, about 20 minutes):

```bash
mvn clean compile exec:java
```

Quick one-epoch check (about 2 minutes):

```bash
mvn "-Ddeepnetts.epochs=1" clean compile exec:java
```

Last lines of the one-epoch run:

```text
Images: 1000
...
Actual digit: 7
Predicted digit: 3
Confidence: 0.6999
```

```bash
cd ../../..
```

#### Lego Figure Recognition

Binary CNN that detects Lego figures. [README](examples/img-classification/lego-figure-recognition/) - [Explained in the Cookbook](https://www.deepnetts.com/cookbook/examples/image-classification/lego-figure-recognition/)

```bash
cd examples/img-classification/lego-figure-recognition
```

Full training (15 epochs, about 20-25 minutes):

```bash
mvn clean compile exec:java
```

Quick one-epoch check (about 2 minutes):

```bash
mvn "-Ddeepnetts.epochs=1" clean compile exec:java
```

Last lines of the one-epoch run:

```text
Images: 634
Images by class: {negativ=6, negative=172, legoman=456}
...
Actual: negative
Predicted: legoman
Lego probability: 0.7656
```

```bash
cd ../../..
```

#### TensorFlow VGGNet16 Import

Imports TensorFlow/ImageNet weights and runs VGGNet16 inference. [README](examples/img-classification/tensorflow-vggnet16-import/) - [Explained in the Cookbook](https://www.deepnetts.com/cookbook/examples/image-classification/tensorflow-vggnet16-import/)

```bash
cd examples/img-classification/tensorflow-vggnet16-import
```

Needs at least 12 GB of RAM and downloads about 600 MB of weights on the first run. macOS or Linux:

```bash
MAVEN_OPTS="-Xmx8g" mvn clean compile exec:java
```

Windows PowerShell:

```powershell
$env:MAVEN_OPTS="-Xmx8g"
```

```powershell
mvn clean compile exec:java
```

Windows Command Prompt:

```bat
set MAVEN_OPTS=-Xmx8g
```

```bat
mvn clean compile exec:java
```

The last lines show the predicted ImageNet label (an elephant class for the bundled image) and its confidence. Details and fixes: [example README](examples/img-classification/tensorflow-vggnet16-import/README.md#if-something-goes-wrong).

```bash
cd ../../..
```

## Run from Apache NetBeans

1. Install [Apache NetBeans](https://netbeans.apache.org/front/main/download/) with Java 25 or newer.
2. Choose **File -> Open Project** and select one example folder, for example `examples/hello-world`.
3. Click **Run Project** (F6). NetBeans uses the project folder as the working directory, so the dataset paths work without changes.
4. For a one-epoch run of an image example, right-click the project, choose **Properties -> Run**, and set **VM Options** to `-Ddeepnetts.epochs=1`. For VGGNet16, set **VM Options** to `-Xmx8g`.

## Troubleshooting

- **`'mvn' is not recognized` or `mvn: command not found`** - Maven is not installed or not on the `PATH`. Follow [Maven](#maven), open a new terminal, and run `mvn --version` again.
- **`release version 25 not supported` or `Java 25 or newer is required`** - Maven runs on an older Java. Install JDK 25 and point `JAVA_HOME` to it, as described in [Java 25 or newer](#java-25-or-newer).
- **`Could not resolve dependencies` or `Could not transfer artifact com.deepnetts:deepnetts-core`** - Maven cannot reach Maven Central. Check the internet connection and any proxy or mirror in `~/.m2/settings.xml`, then force Maven to try again:

```bash
mvn -U clean compile exec:java
```
- **`NoSuchFileException` or `FileNotFoundException` for `src/main/resources/datasets/...`** - the command was not started from the example folder. Go back to the repository root, run the `cd` command from step 1, and run the example again.
- **`LifecyclePhaseNotFoundException` mentioning `.epochs=1`** (Windows PowerShell) - PowerShell split the option. Keep the quotes exactly as shown:

```bash
mvn "-Ddeepnetts.epochs=1" clean compile exec:java
```
- **Training takes too long** - run the one-epoch command above. It checks the complete workflow in a few minutes.
- `WARNING: A terminally deprecated method in sun.misc.Unsafe has been called` at the start of a Maven command is printed by Maven itself on Java 24 and newer. It is harmless; ignore it.
- **`java.lang.OutOfMemoryError: Java heap space`** (VGGNet16) - set `MAVEN_OPTS` to `-Xmx8g` in the same terminal, as shown in the VGGNet16 commands, and use a computer with at least 12 GB of RAM.
- **`Filename too long`** (Windows, while cloning) - see [Get the examples](#2-get-the-examples).

For problems with a specific example, see the "If something goes wrong" section of its README. For problems with the Deep Netts library itself, use the [Deep Netts Community Edition repository](https://github.com/deepnetts/deepnetts-communityedition) on GitHub.

## Repository structure

```text
cookbook-examples/
└── examples/
    ├── hello-world/              # Environment verification
    ├── regression/               # Four tabular regression projects
    ├── classification/           # Four tabular classification projects
    └── img-classification/       # Six CNN/import projects
```

Inside each example, the Java code is under `src/main/java/`, the dataset under `src/main/resources/datasets/`, and the Maven configuration in `pom.xml`.
