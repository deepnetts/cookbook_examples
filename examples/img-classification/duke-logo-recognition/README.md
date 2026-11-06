# Duke Logo Recognition with Deep Netts

This Java 25 example trains a convolutional neural network to recognize the
Java Duke logo. The dataset comes from the original
[Deep Netts Duke Image Recognition project](https://github.com/deepnetts/DukeImageRecognition)
and contains 49 Duke images and 54 negative images.

The single Java class follows the complete cookbook flow: load and inspect the
images, create an 80/20 split, preprocess, build and train a CNN, evaluate on
held-out images, save the model, and classify one test image.

## Run this example

**Requirements:** Java 25 or newer, Maven, and Git. If you are not sure they are installed, follow [Check your environment](../../../README.md#1-check-your-environment) first.

Maven downloads Deep Netts Community Edition (`com.deepnetts:deepnetts-core:4.0.5`) from Maven Central on the first build. No separate installation or extra JVM option is needed.

**1. Open the example folder.** From the `cookbook-examples` folder (the repository root), run:

```bash
cd examples/img-classification/duke-logo-recognition
```

**2. Build and run the example:**

```bash
mvn clean compile exec:java
```

This trains the network for 20 epochs, which takes about 30 seconds on an 8-core CPU (Community Edition trains on the CPU without Vector API acceleration). To check the complete workflow quickly, train for one epoch instead (about 10 seconds):

```bash
mvn "-Ddeepnetts.epochs=1" clean compile exec:java
```

To train longer, change the number, for example `"-Ddeepnetts.epochs=30"`.

**3. Check the result.** After the one-epoch run, the last lines look like this:

```text
Images: 103
Images by class: {negative=54, duke=49}
...
Actual: duke
Predicted: duke
Duke probability: 0.7515
```

Training progress and metrics are printed in between. With more epochs the numbers change, because the network trains longer. The exact numbers can differ slightly between computers. On systems that use a decimal comma (for example Serbian or German Windows), numbers are printed as `0,9978` instead of `0.9978`.

**Generated files:** `models/duke-logo-classifier.dnet`. Running the example again overwrites the generated files. The `models/` and `target/` folders are ignored by Git.

**Dataset files:**

```text
src/main/resources/datasets/duke-logo/
├── duke/
├── negative/
├── index.txt
└── labels.txt
```

Go back to the repository root when you are done:

```bash
cd ../../..
```

### If something goes wrong

- **`'mvn' is not recognized` or `mvn: command not found`** - Maven is not installed or not on the `PATH`. Follow [Maven](../../../README.md#maven), open a new terminal, and run `mvn --version` again.
- **`release version 25 not supported` or `Java 25 or newer is required`** - Maven runs on an older Java. Install JDK 25 and point `JAVA_HOME` to it, as described in [Java 25 or newer](../../../README.md#java-25-or-newer).
- **`Could not resolve dependencies` or `Could not transfer artifact com.deepnetts:deepnetts-core`** - Maven cannot reach Maven Central. Check the internet connection and any proxy or mirror in `~/.m2/settings.xml`, then force Maven to try again:

```bash
mvn -U clean compile exec:java
```
- **`NoSuchFileException` or `FileNotFoundException` for `src/main/resources/datasets/...`** - the command was not started from the example folder. Go back to the repository root, run the `cd` command from step 1, and run the example again.
- **`LifecyclePhaseNotFoundException` mentioning `.epochs=1`** (Windows PowerShell) - PowerShell split the option. Keep the quotes exactly as shown:

```bash
mvn "-Ddeepnetts.epochs=1" clean compile exec:java
```
- **Training takes too long** - run the one-epoch command above. It checks the complete workflow in about 10 seconds.
- `WARNING: A terminally deprecated method in sun.misc.Unsafe has been called` at the start of a Maven command is printed by Maven itself on Java 24 and newer. It is harmless; ignore it.

More fixes are listed in [Troubleshooting](../../../README.md#troubleshooting).

### Run it in Apache NetBeans

1. Choose **File -> Open Project** and select the `examples/img-classification/duke-logo-recognition` folder.
2. Click **Run Project** (F6). NetBeans uses the project folder as the working directory, so the dataset paths work without changes.
3. For a one-epoch run, right-click the project, choose **Properties -> Run**, and set **VM Options** to `-Ddeepnetts.epochs=1`.

## Workflow and model

The indexed images are resized to `64x64` RGB, shuffled with seed 42, and split
80/20. The CNN uses a 3x3 convolution, max pooling, 16 fully connected neurons,
and one Sigmoid output. ADAM trains mini-batches of 8 images. The program prints
class counts, held-out metrics, the actual and predicted label, and Duke
probability, then shuts down the network thread pool.

One epoch is only a functional smoke test. The small dataset also means that
held-out metrics can vary and should not be treated as a production benchmark.

Generated `.dnet` models under `models/` are ignored by Git.
