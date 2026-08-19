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
