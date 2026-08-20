# Lego Figure Recognition with Deep Netts

This Java 25 example trains a convolutional neural network to determine whether
an image contains a Lego figure.

The bundled `LegoPeople` data comes from the original
[Deep Netts examples repository](https://github.com/deepnetts/examples). It
contains `legoman` and `negative` images. Its original `train.txt` deliberately
repeats negative examples to reduce the class imbalance; the example preserves
that training index and normalizes its historical label spellings to
`negative`.

The Java class follows the complete cookbook flow: load and inspect the images,
create a reproducible 80/20 split, preprocess, train a CNN, evaluate on held-out
images, save the model, and classify one test image.

## Run

```bash
MAVEN_OPTS="--add-modules jdk.incubator.vector" \
  mvn clean compile exec:java
```

The default is 15 epochs. Override it with `-Ddeepnetts.epochs=1` for a quick
smoke test. The model is saved to `models/lego-figure-classifier.dnet`.

The dataset structure is:

```text
src/main/resources/datasets/lego-people/
├── legoman/
├── negative/
├── labels.txt
└── train.txt
```

## Requirements and NetBeans

Use Java 25, Maven, Deep Netts 4 Pro with a valid license, and the Vector API.
Open this directory as a Maven project and set **VM Options** to:

```text
--add-modules=jdk.incubator.vector -Ddeepnetts.epochs=1
```

Keep the project directory as the working directory.

## Workflow and architecture

The original index is loaded at `96x96` RGB, historical negative labels are
normalized, and inputs are zero-centered per channel. Indexed examples are
shuffled with seed 42 and split 80/20. The CNN uses a 5x5 convolution with 12
filters, max pooling, two fully connected Tanh layers, and one Sigmoid output.
ADAM trains mini-batches of 16 images.

The program prints counts, held-out metrics, an actual and predicted label, and
Lego probability. Counts include the repeated negative entries deliberately
present in the original training index. One epoch is a smoke test. Generated
models under `models/` are ignored by Git.
