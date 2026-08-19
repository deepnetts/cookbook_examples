[View Example on GitHub](https://github.com/deepnetts/cookbook-examples/tree/main/examples/img-classification/parking-lot-occupancy)

# Parking Lot Occupancy

This walkthrough trains a convolutional network to determine whether a parking-space image is occupied.

**Problem:** Predict `busy` or `negative` from a cropped parking-space image.

**Dataset:** 6,171 image patches: 3,621 occupied spaces and 2,550 free spaces.

## At a glance

| | |
|---|---|
| **ML task** | Binary image classification |
| **Level** | Intermediate |
| **Input** | `48 × 48 × 3` RGB image |
| **Target** | `busy` or `negative` |
| **Default training** | 3 CPU epochs |
| **Model** | Convolution → Max Pooling → Fully Connected → Sigmoid |

[Back to Image Classification examples](index.md)

## 1. Configure the larger dataset

```java
private static final String DATASET_PATH =
        "src/main/resources/datasets/parking-lot";
private static final String MODEL_PATH =
        "models/parking-occupancy.dnet";
private static final int IMAGE_WIDTH = 48;
private static final int IMAGE_HEIGHT = 48;
private static final int STOP_EPOCHS =
        Integer.getInteger("deepnetts.epochs", 3);
```

The configurable epoch limit supports both a quick smoke test and a longer accuracy experiment.

## 2. Load, inspect, and split images

```java
ImageSet imageSet = loadImageSet(Path.of(DATASET_PATH));
System.out.println("Images: " + imageSet.size());
System.out.println("Classes: " + imageSet.countByClasses());

imageSet.shuffle(42);
ImageSet[] split = imageSet.split(0.8, 0.2);
ImageSet trainingSet = split[0];
ImageSet testSet = split[1];
```

Images in `busy/` receive target `1`; those in `negative/` receive target `0`. Resizing reduces computation while preserving the local visual structure needed for occupancy detection.

## 3. Build the occupancy CNN

```java
ConvolutionalNetwork neuralNet = ConvolutionalNetwork.builder()
        .addInputLayer(IMAGE_WIDTH, IMAGE_HEIGHT, 3)
        .addConvolutionalLayer(6, Filters.ofSize(3))
        .addMaxPoolingLayer(2, 2)
        .addFullyConnectedLayer(16)
        .addOutputLayer(1, ActivationType.SIGMOID)
        .hiddenActivationFunction(ActivationType.LEAKY_RELU)
        .lossFunction(LossType.CROSS_ENTROPY)
        .randomSeed(42)
        .build();
```

## 4. Train without mistaking a long epoch for a freeze

```java
neuralNet.getTrainer()
        .setStopEpochs(STOP_EPOCHS)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.ADAM)
        .setBatchMode(true)
        .setBatchSize(32)
        .setShuffle(true);

neuralNet.train(trainingSet);
```

On a CPU, one epoch can take approximately 45 seconds. Output appears after an epoch finishes, so a pause after `Initial Train Error` is expected.

For a complete one-epoch NetBeans smoke test, use:

```text
--add-modules=jdk.incubator.vector -Ddeepnetts.epochs=1
```

## 5. Evaluate the model

```java
ClassificationMetrics metrics =
        (ClassificationMetrics) neuralNet.test(testSet);
System.out.println(metrics);
```

Held-out evaluation reports accuracy, precision, recall, F1, specificity, and error rates.

## 6. Save the trained model

```java
Files.createDirectories(Path.of("models"));
neuralNet.save(MODEL_PATH);
```

The saved `.dnet` file can be retained as the trained occupancy-classification artifact.

## 7. Predict parking occupancy

```java
ExampleImage image = testSet.get(0);
float occupiedProbability =
        neuralNet.predict(image.getInput()).getValues()[0];
String predictedClass = occupiedProbability >= 0.5f
        ? "busy" : "negative";
```

The probability retains confidence information; the threshold converts it into the final occupied/free decision.

## What you built

```text
6,171 labeled parking images
        ↓
48x48 RGB preprocessing
        ↓
80/20 split and mini-batch CNN training
        ↓
Classification evaluation
        ↓
Saved occupancy model and prediction
```

<div class="github-project-action">
<a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/img-classification/parking-lot-occupancy">View Example on GitHub</a>
</div>

<a class="back-button" href="../">← Back to Image Classification Examples</a>
