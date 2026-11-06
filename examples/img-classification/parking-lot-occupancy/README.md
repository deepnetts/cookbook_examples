# Parking Lot Occupancy with Deep Netts

This Java 25 example trains a convolutional neural network to classify a
parking-space image as occupied (`busy`) or free (`negative`). The 6,171 image
patches come from the dataset included in the original
[Deep Netts Parking Lot Occupancy project](https://github.com/deepnetts/ParkingLotOccupancyDetection).

The Java class contains the complete flow: loading and inspecting images,
creating an 80/20 split, preprocessing, CNN training, held-out evaluation,
model saving, and prediction on one test image.

## Run this example

**Requirements:** Java 25 or newer, Maven, and Git. If you are not sure they are installed, follow [Check your environment](../../../README.md#1-check-your-environment) first.

Maven downloads Deep Netts Community Edition (`com.deepnetts:deepnetts-core:4.0.5`) from Maven Central on the first build. No separate installation or extra JVM option is needed.

**1. Open the example folder.** From the `cookbook-examples` folder (the repository root), run:

```bash
cd examples/img-classification/parking-lot-occupancy
```

**2. Build and run the example:**

```bash
mvn clean compile exec:java
```

This trains the network for 3 epochs, which takes about 3 minutes on an 8-core CPU (Community Edition trains on the CPU without Vector API acceleration). To check the complete workflow quickly, train for one epoch instead (about 2 minutes):

```bash
mvn "-Ddeepnetts.epochs=1" clean compile exec:java
```

To train longer, change the number, for example `"-Ddeepnetts.epochs=30"`.

**3. Check the result.** After the one-epoch run, the last lines look like this:

```text
Images: 6171
Images by class: {negative=2550, busy=3621}
...
Actual: busy
Predicted: busy
Occupied probability: 0.9958
```

Training progress and metrics are printed in between. With more epochs the numbers change, because the network trains longer. The exact numbers can differ slightly between computers. On systems that use a decimal comma (for example Serbian or German Windows), numbers are printed as `0,9978` instead of `0.9978`.

**Generated files:** `models/parking-occupancy.dnet`. Running the example again overwrites the generated files. The `models/` and `target/` folders are ignored by Git.

**Dataset files:**

```text
src/main/resources/datasets/parking-lot/
├── busy/       # 3,621 occupied spaces
├── negative/   # 2,550 free spaces
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
- **Training takes too long** - run the one-epoch command above. It checks the complete workflow in about 2 minutes.
- `WARNING: A terminally deprecated method in sun.misc.Unsafe has been called` at the start of a Maven command is printed by Maven itself on Java 24 and newer. It is harmless; ignore it.

More fixes are listed in [Troubleshooting](../../../README.md#troubleshooting).

### Run it in Apache NetBeans

1. Choose **File -> Open Project** and select the `examples/img-classification/parking-lot-occupancy` folder.
2. Click **Run Project** (F6). NetBeans uses the project folder as the working directory, so the dataset paths work without changes.
3. For a one-epoch run, right-click the project, choose **Properties -> Run**, and set **VM Options** to `-Ddeepnetts.epochs=1`.

## Workflow

The loader validates and resizes every indexed image to `48x48` RGB. After a seed-42 shuffle and
80/20 split, a compact convolution/pooling network trains with ADAM in mini-batches of 32. The program
evaluates held-out images, saves the model, predicts one image, and shuts down its thread pool.
