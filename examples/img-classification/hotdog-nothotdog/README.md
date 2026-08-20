# Hot Dog or Not Hot Dog with Deep Netts

This example demonstrates a complete **binary image-classification workflow**
with a convolutional neural network in Java.

The model learns to distinguish:

```text
hot_dog  = an image containing a hot dog
negative = an image that does not contain a hot dog
```

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

## Requirements

- Java 25
- Maven
- Deep Netts 4 Pro installed in the local Maven repository
- a valid Deep Netts license
- Java Vector API enabled

## Run

From this project directory:

```bash
MAVEN_OPTS="--add-modules jdk.incubator.vector" \
  mvn clean compile exec:java
```

### Quick NetBeans test

To verify the complete network flow without waiting for the default training
run, open **Project Properties → Run → VM Options** and use:

```text
--add-modules=jdk.incubator.vector -Ddeepnetts.epochs=1
```

One epoch verifies image loading, CNN training, evaluation, model saving, and
prediction. It is a functional smoke test, not a meaningful accuracy run.

Training a convolutional network is more computationally expensive than the
tabular examples. The default run uses 10 epochs and can take several minutes
on CPU. Increase the epoch limit for a longer experiment:

```bash
MAVEN_OPTS="--add-modules jdk.incubator.vector" \
  mvn -Ddeepnetts.epochs=50 clean compile exec:java
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
