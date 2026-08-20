# Parking Lot Occupancy with Deep Netts

This Java 25 example trains a convolutional neural network to classify a
parking-space image as occupied (`busy`) or free (`negative`). The 6,171 image
patches come from the dataset included in the original
[Deep Netts Parking Lot Occupancy project](https://github.com/deepnetts/ParkingLotOccupancyDetection).

The Java class contains the complete flow: loading and inspecting images,
creating an 80/20 split, preprocessing, CNN training, held-out evaluation,
model saving, and prediction on one test image.

## Run

```bash
MAVEN_OPTS="--add-modules jdk.incubator.vector" \
  mvn clean compile exec:java
```

### Quick NetBeans test

The full dataset contains 6,171 images, so CPU training takes longer. To test
the complete network flow with one epoch, open
**Project Properties → Run → VM Options** and use:

```text
--add-modules=jdk.incubator.vector -Ddeepnetts.epochs=1
```

The program will still load the complete dataset, train, evaluate, save the
model, and run a prediction. Use more epochs when evaluating model quality.

The default is 3 epochs because this dataset is much larger than the other
cookbook image datasets. Override it with `-Ddeepnetts.epochs=15`. The model is
saved to `models/parking-occupancy.dnet`.

```text
src/main/resources/datasets/parking-lot/
├── busy/       # 3,621 occupied spaces
└── negative/   # 2,550 free spaces
```

## Requirements and workflow

Use Java 25, Maven, Deep Netts 4 Pro with a valid license, and the Vector API.
The loader validates and resizes every indexed image to `48x48` RGB. After a
seed-42 shuffle and 80/20 split, a compact convolution/pooling network trains
with ADAM in mini-batches of 32. The program evaluates held-out images, saves
the model, predicts one image, and shuts down its thread pool.

From the project directory, run:

```bash
MAVEN_OPTS="--add-modules jdk.incubator.vector" \
  mvn -Ddeepnetts.epochs=1 clean compile exec:java
```

One CPU epoch may take roughly 45 seconds depending on hardware. Generated
`.dnet` models under `models/` are ignored by Git.
