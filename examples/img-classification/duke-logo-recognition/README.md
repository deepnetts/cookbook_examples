# Duke Logo Recognition with Deep Netts

This Java 25 example trains a convolutional neural network to recognize the
Java Duke logo. The dataset comes from the original
[Deep Netts Duke Image Recognition project](https://github.com/deepnetts/DukeImageRecognition)
and contains 49 Duke images and 54 negative images.

The single Java class follows the complete cookbook flow: load and inspect the
images, create an 80/20 split, preprocess, build and train a CNN, evaluate on
held-out images, save the model, and classify one test image.

## Run

```bash
MAVEN_OPTS="--add-modules jdk.incubator.vector" \
  mvn clean compile exec:java
```

The default is 20 epochs. Override it with
`-Ddeepnetts.epochs=50`. The trained model is saved to
`models/duke-logo-classifier.dnet`.

The dataset structure is:

```text
src/main/resources/datasets/duke-logo/
├── duke/
└── negative/
```

## Requirements

- Java 25 and Maven
- Deep Netts 4 Pro and its license in the local Maven repository
- Vector API enabled at runtime

## NetBeans

Open this directory as a Maven project. Under **Project Properties → Run**, keep
the project directory as the working directory and set **VM Options** to:

```text
--add-modules=jdk.incubator.vector -Ddeepnetts.epochs=1
```

## Workflow and model

The indexed images are resized to `64x64` RGB, shuffled with seed 42, and split
80/20. The CNN uses a 3x3 convolution, max pooling, 16 fully connected neurons,
and one Sigmoid output. ADAM trains mini-batches of 8 images. The program prints
class counts, held-out metrics, the actual and predicted label, and Duke
probability, then shuts down the network thread pool.

One epoch is only a functional smoke test. The small dataset also means that
held-out metrics can vary and should not be treated as a production benchmark.

Generated `.dnet` models under `models/` are ignored by Git.
