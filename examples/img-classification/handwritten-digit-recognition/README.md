# Handwritten Digit Recognition with Deep Netts

This Java 25 example trains a convolutional neural network to classify
handwritten digits from `0` to `9`.

The bundled data is a deterministic, balanced subset of the
[MNIST training set](https://github.com/JavaVisRec/jsr381-examples-datasets):
1,000 grayscale 28x28 images, with 100 images for each digit. The original
MNIST training set contains 60,000 images.

The single Java class follows the complete cookbook flow: load and inspect the
images, create a reproducible 80/20 split, preprocess, train a CNN, evaluate on
held-out images, save the model, and classify one test image.

## Run

```bash
MAVEN_OPTS="--add-modules jdk.incubator.vector" \
  mvn clean compile exec:java
```

The default is 10 epochs. Override it with `-Ddeepnetts.epochs=1` for a quick
smoke test. The model is saved to `models/mnist-classifier.dnet`.

The dataset structure is:

```text
src/main/resources/datasets/mnist/
├── 0/
├── 1/
├── ...
└── 9/
```

## Requirements and NetBeans

Use Java 25, Maven, Deep Netts 4 Pro with a valid license, and the Vector API.
Open this directory as a Maven project and add:

```text
--add-modules=jdk.incubator.vector -Ddeepnetts.epochs=1
```

to **Project Properties → Run → VM Options**. Keep the project directory as the
working directory so relative dataset and model paths resolve correctly.

## Workflow and architecture

The loader validates the index, converts images to `28x28` grayscale, and
inverts their intensity. After a seed-42 shuffle and 80/20 split, the network
uses two convolution/pooling blocks, two 60-neuron fully connected layers, and
10 Softmax outputs. ADAM trains mini-batches of 32 images.

The program prints dataset counts, held-out classification metrics, the actual
and predicted digit, and prediction confidence. One epoch checks the full
load-to-prediction flow but is not a final accuracy run. Generated models under
`models/` are ignored by Git.
