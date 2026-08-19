[View Example on GitHub](https://github.com/deepnetts/cookbook-examples/tree/main/examples/img-classification/hotdog-nothotdog)

# Hot Dog or Not Hot Dog

This walkthrough builds a convolutional neural network that distinguishes hot-dog images from other images.

**Problem:** Predict `hot_dog` or `negative` from an RGB image.

**Dataset:** 467 labeled images: 239 hot dogs and 228 negative examples.

**You will learn:** How to load images from class directories, resize and scale pixels, create a held-out test set, train a CNN, save it, and classify an unseen image.

## At a glance

| | |
|---|---|
| **ML task** | Binary image classification |
| **Level** | Intermediate |
| **Input** | `64 × 64 × 3` RGB image |
| **Target** | `hot_dog` or `negative` |
| **Model** | Convolution → Max Pooling → Fully Connected → Sigmoid |
| **Runtime** | Java 25 with the Vector API |

[Back to Image Classification examples](index.md)

## 1. Configure the project

Define the dataset, saved-model path, image shape, and configurable epoch limit:

```java
private static final String DATASET_PATH =
        "src/main/resources/datasets/hotdog-dataset";
private static final String MODEL_PATH = "models/hotdog-classifier.dnet";
private static final int IMAGE_WIDTH = 64;
private static final int IMAGE_HEIGHT = 64;
private static final int STOP_EPOCHS =
        Integer.getInteger("deepnetts.epochs", 10);
```

The system property makes a one-epoch smoke test possible without changing source code.

## 2. Load and label the images

The dataset uses one directory per class:

```text
hotdog-dataset/
├── hot_dog/
└── negative/
```

Each image is resized before `ExampleImage` converts its RGB channels to values in `[0, 1]`:

```java
BufferedImage resized = ImageUtils.scaleImage(
        source, IMAGE_WIDTH, IMAGE_HEIGHT);

ExampleImage image = new ExampleImage(
        imagePath.toFile(), resized, className);
image.setTargetOutput(new Tensor1D(target));
imageSet.add(image);
```

The positive `hot_dog` class uses target `1`; the negative class uses `0`.

## 3. Inspect, shuffle, and split

Confirm the class counts before training:

```java
System.out.println("Images: " + imageSet.size());
System.out.println("Classes: " + imageSet.countByClasses());

imageSet.shuffle(42);
ImageSet[] split = imageSet.split(0.8, 0.2);
ImageSet trainingSet = split[0];
ImageSet testSet = split[1];
```

The model updates its parameters only from the training images. Test images remain held out for evaluation.

## 4. Build the convolutional network

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

Convolution learns local visual patterns, pooling reduces their spatial size, and the Sigmoid output represents hot-dog probability.

## 5. Train the model

```java
neuralNet.getTrainer()
        .setStopEpochs(STOP_EPOCHS)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.ADAM)
        .setBatchMode(true)
        .setBatchSize(16)
        .setShuffle(true);

neuralNet.train(trainingSet);
```

Image training is more computationally expensive than the tabular examples. In NetBeans, use this VM option for a quick functional test:

```text
--add-modules=jdk.incubator.vector -Ddeepnetts.epochs=1
```

## 6. Evaluate the model

```java
ClassificationMetrics metrics =
        (ClassificationMetrics) neuralNet.test(testSet);
System.out.println(metrics);
```

The held-out metrics show how well the network distinguishes hot-dog images from negative examples it did not train on.

## 7. Save the trained model

```java
Files.createDirectories(Path.of("models"));
neuralNet.save(MODEL_PATH);
```

The saved `.dnet` file is the reusable artifact produced by training.

## 8. Predict an image class

Classify one held-out image with the trained in-memory model:

```java
ExampleImage image = testSet.get(0);
float probability = neuralNet.predict(image.getInput()).getValues()[0];
String predictedClass = probability >= 0.5f
        ? "hot_dog" : "negative";
```

## What you built

```text
Labeled RGB images
        ↓
Resize and scale pixels
        ↓
80/20 train/test split
        ↓
Convolution + pooling network
        ↓
Held-out evaluation
        ↓
Saved model and image prediction
```

<div class="github-project-action">
<a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/img-classification/hotdog-nothotdog">View Example on GitHub</a>
</div>

<a class="back-button" href="../">← Back to Image Classification Examples</a>
