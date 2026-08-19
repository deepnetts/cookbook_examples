[View Example on GitHub](https://github.com/deepnetts/cookbook-examples/tree/main/examples/img-classification/duke-logo-recognition)

# Duke Logo Recognition

This walkthrough builds a compact convolutional network that recognizes the Java Duke logo.

**Problem:** Decide whether an image contains Duke.

**Dataset:** 49 Duke images and 54 negative images.

## At a glance

| | |
|---|---|
| **ML task** | Binary image classification |
| **Level** | Intermediate |
| **Input** | `64 × 64 × 3` RGB image |
| **Target** | `duke` or `negative` |
| **Model** | Convolution → Max Pooling → Fully Connected → Sigmoid |

[Back to Image Classification examples](index.md)

## 1. Define the image contract

```java
private static final String DATASET_PATH =
        "src/main/resources/datasets/duke-logo";
private static final String MODEL_PATH =
        "models/duke-logo-classifier.dnet";
private static final int IMAGE_WIDTH = 64;
private static final int IMAGE_HEIGHT = 64;
```

Every image is resized to the same input shape. The positive Duke target is `1`; negative images use `0`.

## 2. Load and inspect the dataset

```java
ImageSet imageSet = loadImageSet(Path.of(DATASET_PATH));

System.out.println("Images: " + imageSet.size());
System.out.println("Classes: " + imageSet.countByClasses());
```

The loader reads `duke/` and `negative/`, resizes each file, and creates an `ExampleImage` with its known target.

## 3. Create held-out evaluation data

```java
imageSet.shuffle(42);
ImageSet[] split = imageSet.split(0.8, 0.2);
ImageSet trainingSet = split[0];
ImageSet testSet = split[1];
```

The small dataset makes the result sensitive to the split, so the test metrics should be treated as a learning demonstration rather than a production benchmark.

## 4. Build the CNN

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

The convolutional layer learns local logo patterns, pooling reduces spatial dimensions, and the Sigmoid output returns the probability that Duke is present.

## 5. Train the model

```java

neuralNet.getTrainer()
        .setStopEpochs(STOP_EPOCHS)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.ADAM)
        .setBatchMode(true)
        .setBatchSize(8)
        .setShuffle(true);

neuralNet.train(trainingSet);
```

## 6. Evaluate the model

```java
ClassificationMetrics metrics =
        (ClassificationMetrics) neuralNet.test(testSet);
System.out.println(metrics);
```

Evaluation uses only held-out images and reports how reliably the network separates Duke from negative examples.

## 7. Save the trained model

```java
Files.createDirectories(Path.of("models"));
neuralNet.save(MODEL_PATH);
```

Saving produces a reusable `.dnet` model artifact without retraining the network.

## 8. Recognize Duke

Use the same resized and scaled image representation for prediction:

```java
ExampleImage image = testSet.get(0);
float dukeProbability =
        neuralNet.predict(image.getInput()).getValues()[0];
String predictedClass = dukeProbability >= 0.5f
        ? "duke" : "negative";
```

## What you built

```text
Duke and negative images
        ↓
64x64 RGB preprocessing
        ↓
CNN training and held-out evaluation
        ↓
Saved Duke recognizer
        ↓
Probability and predicted class
```

<div class="github-project-action">
<a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/img-classification/duke-logo-recognition">View Example on GitHub</a>
</div>

<a class="back-button" href="../">← Back to Image Classification Examples</a>
