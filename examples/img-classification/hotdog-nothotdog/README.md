# Hot Dog or Not Hot Dog with Deep Netts

This example demonstrates a complete **binary image-classification workflow**
with a convolutional neural network in Java.

The model learns to distinguish:

```text
hot_dog  = an image containing a hot dog
negative = an image that does not contain a hot dog
```

## Run this example

**Requirements:** Java 25 or newer, Maven, and Git. If you are not sure they are installed, follow [Check your environment](../../../README.md#1-check-your-environment) first.

Maven downloads Deep Netts Community Edition (`com.deepnetts:deepnetts-core:4.0.5`) from Maven Central on the first build. No separate installation or extra JVM option is needed.

**1. Open the example folder.** From the `cookbook-examples` folder (the repository root), run:

```bash
cd examples/img-classification/hotdog-nothotdog
```

**2. Build and run the example:**

```bash
mvn clean compile exec:java
```

This trains the network for 10 epochs, which takes about 1 minute on an 8-core CPU (Community Edition trains on the CPU without Vector API acceleration). To check the complete workflow quickly, train for one epoch instead (about 20 seconds):

```bash
mvn "-Ddeepnetts.epochs=1" clean compile exec:java
```

To train longer, change the number, for example `"-Ddeepnetts.epochs=30"`.

**3. Check the result.** After the one-epoch run, the last lines look like this:

```text
Images: 467
Images by class: {negative=228, hot_dog=239}
...
Actual: hot_dog
Predicted: hot_dog
Hot-dog probability: 0.6097
```

Training progress and metrics are printed in between. With more epochs the numbers change, because the network trains longer. The exact numbers can differ slightly between computers. On systems that use a decimal comma (for example Serbian or German Windows), numbers are printed as `0,9978` instead of `0.9978`.

**Generated files:** `models/hotdog-classifier.dnet`. Running the example again overwrites the generated files. The `models/` and `target/` folders are ignored by Git.

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
- **Training takes too long** - run the one-epoch command above. It checks the complete workflow in about 20 seconds.
- `WARNING: A terminally deprecated method in sun.misc.Unsafe has been called` at the start of a Maven command is printed by Maven itself on Java 24 and newer. It is harmless; ignore it.

More fixes are listed in [Troubleshooting](../../../README.md#troubleshooting).

### Run it in Apache NetBeans

1. Choose **File -> Open Project** and select the `examples/img-classification/hotdog-nothotdog` folder.
2. Click **Run Project** (F6). NetBeans uses the project folder as the working directory, so the dataset paths work without changes.
3. For a one-epoch run, right-click the project, choose **Properties -> Run**, and set **VM Options** to `-Ddeepnetts.epochs=1`.

## Dataset

The dataset comes from the original
[Deep Netts Hot Dog or Not Hot Dog project](https://github.com/deepnetts/hotdog-nothotdog).
It contains 467 RGB images:

```text
239 hot_dog images
228 negative images
```

`ImageData` reads each path and class name from `index.txt`, validates the
referenced file, and keeps the directory labels explicit:

```text
src/main/resources/datasets/hotdog-dataset/
├── hot_dog/
└── negative/
```

The images are resized to `64 × 64` pixels and their pixel values are scaled
while loading.

## Project structure

```text
hotdog-nothotdog/
├── README.md
├── pom.xml
├── models/                         # created after training
└── src/main/
    ├── java/com/deepnetts/examples/hotdognothotdog/
    │   └── HotDogImageClassificationDeepNetts.java
    └── resources/datasets/hotdog-dataset/
        ├── hot_dog/
        └── negative/
```

## Workflow

The single Java class follows the same numbered flow as the other cookbook
examples:

```text
Verify Java runtime
        |
        v
Load and inspect images
        |
        v
Shuffle and create an 80/20 train/test split
        |
        v
Build and train a convolutional network
        |
        v
Evaluate on unseen test images
        |
        v
Save the trained model
        |
        v
Classify one test image
```

The model architecture is:

```text
64x64x3 input
    -> 6 convolution filters (3x3)
    -> 2x2 max pooling
    -> 16 fully connected neurons
    -> 1 Sigmoid output
```

The fixed random seed makes model initialization and dataset shuffling easier
to reproduce. Evaluation uses the held-out test set rather than the images used
for training.

## Output

The program prints:

- dataset and split sizes
- class counts
- classification metrics on the test set
- saved model path
- actual and predicted class for one held-out image
- the predicted hot-dog probability

The trained model is saved to:

```text
models/hotdog-classifier.dnet
```

The `models/` directory and `.dnet` files are intentionally ignored by Git.
