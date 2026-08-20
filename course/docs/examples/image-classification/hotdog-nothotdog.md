[View Example on GitHub](https://github.com/deepnetts/cookbook-examples/tree/main/examples/img-classification/hotdog-nothotdog)

# Hot Dog or Not Hot Dog

This walkthrough trains a CNN to distinguish hot-dog images from unrelated images.

**Problem:** Classify an image as `hot_dog` or `negative`.

**Dataset:** 467 labeled images: 239 hot-dog images and 228 negative images.

## At a glance

| | |
|---|---|
| **ML task** | Binary image classification |
| **Input** | `64 × 64 × 3` RGB image |
| **Target** | `hot_dog` or `negative` |
| **Model** | Convolution → Max Pooling → Fully Connected → Sigmoid |
| **Preprocessing** | Resize to `64 × 64` and scale RGB values while loading |
| **Default training** | 10 CPU epochs |
| **Saved model** | `models/hotdog-classifier.dnet` |

## 1. Configure the runtime

```java
int width = 64, height = 64;
int epochs = Integer.getInteger("deepnetts.epochs", 10);
String dataset = "src/main/resources/datasets/hotdog-dataset";
System.setProperty("java.awt.headless", "true");
DeepNetts.getInstance().setUseCuda(false);
```

## 2. Load and preprocess

```java
ImageSet images = ImageData.load(dataset, "index.txt", width, height, false, false);
```

The index assigns each file its `hot_dog` or `negative` label. The loader validates files, resizes them, and creates RGB tensors.

## 3. Inspect, shuffle, and split

```java
System.out.println("Images: " + images.size());
System.out.println("Images by class: " + images.countByClasses());
images.shuffle(42);
ImageSet[] split = images.split(0.8, 0.2);
ImageSet trainingSet = split[0];
ImageSet testSet = split[1];
```

## 4. Build the CNN

```java
ConvolutionalNetwork network = ConvolutionalNetwork.builder()
        .addInputLayer(width, height, 3)
        .addConvolutionalLayer(6, Filters.ofSize(3))
        .addMaxPoolingLayer(2, 2)
        .addFullyConnectedLayer(16)
        .addOutputLayer(1, ActivationType.SIGMOID)
        .hiddenActivationFunction(ActivationType.LEAKY_RELU)
        .lossFunction(LossType.CROSS_ENTROPY)
        .randomSeed(42).build();
```

## 5. Train and evaluate

```java
network.getTrainer().setStopEpochs(epochs).setLearningRate(0.001f)
        .setOptimizer(OptimizerType.ADAM).setBatchMode(true)
        .setBatchSize(16).setShuffle(true);
network.train(trainingSet);
System.out.println(network.test(testSet));
```

## 6. Save the model

```java
Files.createDirectories(Path.of("models"));
network.save("models/hotdog-classifier.dnet");
```

The saved model is the reusable result of training.

## 7. Make a prediction

```java
ExampleImage image = testSet.get(0);
float probability = network.predict(image.getInput()).getValues()[0];
String predicted = probability >= 0.5f ? "hot_dog" : "negative";
```

The program prints the real label, predicted label, and hot-dog probability.

## 8. Release resources

```java
network.getThreadPool().shutdown();
```

This safely stops the network's background worker threads.

## Run in NetBeans

```text
--add-modules=jdk.incubator.vector -Ddeepnetts.epochs=1
```

One epoch is a complete functional smoke test, not a final accuracy run.

<div class="github-project-action"><a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/img-classification/hotdog-nothotdog">View Example on GitHub</a></div>

<a class="back-button" href="./">← Back to Image Classification Examples</a>
