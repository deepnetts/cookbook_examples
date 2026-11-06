# Lego Figure Recognition with Deep Netts

This Java 25 example trains a convolutional neural network to determine whether
an image contains a Lego figure.

The bundled `LegoPeople` data comes from the original
[Deep Netts examples repository](https://github.com/deepnetts/examples). It
contains `legoman` and `negative` images. Its original `train.txt` deliberately
repeats negative examples to reduce the class imbalance; the example preserves
that training index unchanged. Six entries use the historical label spelling
`negativ`; they are still negative examples, because the target is 1 only for `legoman`.

The Java class follows the complete cookbook flow: load and inspect the images,
create a reproducible 80/20 split, preprocess, train a CNN, evaluate on held-out
images, save the model, and classify one test image.

## Run this example

**Requirements:** Java 25 or newer, Maven, and Git. If you are not sure they are installed, follow [Check your environment](../../../README.md#1-check-your-environment) first.

Maven downloads Deep Netts Community Edition (`com.deepnetts:deepnetts-core:4.0.5`) from Maven Central on the first build. No separate installation or extra JVM option is needed.

**1. Open the example folder.** From the `cookbook-examples` folder (the repository root), run:

```bash
cd examples/img-classification/lego-figure-recognition
```

**2. Build and run the example:**

```bash
mvn clean compile exec:java
```

This trains the network for 15 epochs, which takes about 20-25 minutes on an 8-core CPU (Community Edition trains on the CPU without Vector API acceleration). To check the complete workflow quickly, train for one epoch instead (about 2 minutes):

```bash
mvn "-Ddeepnetts.epochs=1" clean compile exec:java
```

To train longer, change the number, for example `"-Ddeepnetts.epochs=30"`.

**3. Check the result.** After the one-epoch run, the last lines look like this:

```text
Images: 634
Images by class: {negativ=6, negative=172, legoman=456}
...
Actual: negative
Predicted: legoman
Lego probability: 0.7656
```

Training progress and metrics are printed in between. With more epochs the numbers change, because the network trains longer. The exact numbers can differ slightly between computers. On systems that use a decimal comma (for example Serbian or German Windows), numbers are printed as `0,9978` instead of `0.9978`.

**Generated files:** `models/lego-figure-classifier.dnet`. Running the example again overwrites the generated files. The `models/` and `target/` folders are ignored by Git.

**Dataset files:**

```text
src/main/resources/datasets/lego-people/
├── legoman/
├── negative/
├── labels.txt
└── train.txt
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
- **Training takes too long** - run the one-epoch command above. It checks the complete workflow in about 2 minutes.
- `WARNING: A terminally deprecated method in sun.misc.Unsafe has been called` at the start of a Maven command is printed by Maven itself on Java 24 and newer. It is harmless; ignore it.

More fixes are listed in [Troubleshooting](../../../README.md#troubleshooting).

### Run it in Apache NetBeans

1. Choose **File -> Open Project** and select the `examples/img-classification/lego-figure-recognition` folder.
2. Click **Run Project** (F6). NetBeans uses the project folder as the working directory, so the dataset paths work without changes.
3. For a one-epoch run, right-click the project, choose **Properties -> Run**, and set **VM Options** to `-Ddeepnetts.epochs=1`.

## Workflow and architecture

The original index is loaded at `96x96` RGB and inputs are zero-centered per
channel. Indexed examples are
shuffled with seed 42 and split 80/20. The CNN uses a 5x5 convolution with 12
filters, max pooling, two fully connected Tanh layers, and one Sigmoid output.
ADAM trains mini-batches of 16 images.

The program prints counts, held-out metrics, an actual and predicted label, and
Lego probability. Counts include the repeated negative entries deliberately
present in the original training index. Because the same negative image can
end up in both the training and the test set, the test accuracy is optimistic. One epoch is a smoke test. Generated
models under `models/` are ignored by Git.
