[View Example on GitHub](https://github.com/deepnetts/cookbook-examples/tree/main/examples/img-classification/duke-logo-recognition)

# Duke Logo Recognition

This walkthrough trains a compact CNN to decide whether an image contains the Java Duke logo.

**Problem:** Classify an image as `duke` or `negative`.

**Dataset:** 103 labeled images: 49 Duke-logo images and 54 negative images.

## At a glance

| | |
|---|---|
| **ML task** | Binary image classification |
| **Input** | `64 × 64 × 3` RGB image |
| **Target** | `duke` or `negative` |
| **Model** | Convolution → Max Pooling → Fully Connected → Sigmoid |
| **Preprocessing** | Resize to `64 × 64` and scale RGB values while loading |
| **Default training** | 20 CPU epochs |
| **Saved model** | `models/duke-logo-classifier.dnet` |

## 1. Configure the runtime

```java
int width = 64, height = 64;
int epochs = Integer.getInteger("deepnetts.epochs", 20);
String dataset = "src/main/resources/datasets/duke-logo";
System.setProperty("java.awt.headless", "true");
DeepNetts.getInstance().setUseCuda(false);
```

The system property lets NetBeans run a one-epoch smoke test without changing source.

## 2. Load and preprocess

```java
ImageSet images = ImageData.load(dataset, "index.txt", width, height, false, false);
```

`index.txt` maps files to labels. The shared loader validates every entry, resizes images, and prepares three RGB channels. Grayscale conversion and inversion are disabled.

## 3. Inspect, shuffle, and split

```java
System.out.println("Images: " + images.size());
System.out.println("Images by class: " + images.countByClasses());
images.shuffle(42);
ImageSet[] split = images.split(0.8, 0.2);
ImageSet trainingSet = split[0];
ImageSet testSet = split[1];
```

The fixed seed makes the 80/20 split reproducible.

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

Convolution learns local logo patterns; the output represents Duke probability.

## 5. Train and evaluate

```java
network.getTrainer().setStopEpochs(epochs).setLearningRate(0.001f)
        .setOptimizer(OptimizerType.ADAM).setBatchMode(true)
        .setBatchSize(8).setShuffle(true);
network.train(trainingSet);
System.out.println(network.test(testSet));
```

Metrics use only held-out images. This small dataset is a learning example, not a production benchmark.

## 6. Save the model

```java
Files.createDirectories(Path.of("models"));
network.save("models/duke-logo-classifier.dnet");
```

The `.dnet` file can be loaded later without retraining the network.

## 7. Make a prediction

```java
ExampleImage image = testSet.get(0);
float probability = network.predict(image.getInput()).getValues()[0];
String predicted = probability >= 0.5f ? "duke" : "negative";
```

The `0.5` threshold converts Duke probability into the final binary label.

## 8. Release resources

```java
network.getThreadPool().shutdown();
```

Shutting down the worker pool allows the Java application to exit cleanly.

## Run in NetBeans

Use **Project Properties → Run → VM Options**:

```text
--add-modules=jdk.incubator.vector -Ddeepnetts.epochs=1
```

One epoch verifies the complete flow; remove the epoch override for the default run.

<div class="github-project-action"><a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/img-classification/duke-logo-recognition">View Example on GitHub</a></div>

<a class="back-button" href="./">← Back to Image Classification Examples</a>
