[View Example on GitHub](https://github.com/deepnetts/cookbook-examples/tree/main/examples/img-classification/lego-figure-recognition)

# Lego Figure Recognition

This walkthrough trains a CNN to decide whether an image contains a Lego figure.

**Problem:** Classify an image as `legoman` or `negative`.

**Dataset:** The original indexed Deep Netts `LegoPeople` dataset, including repeated negative entries used for balancing.

## At a glance

| | |
|---|---|
| **ML task** | Binary image classification |
| **Input** | `96 × 96 × 3` RGB image |
| **Target** | `legoman` or `negative` |
| **Model** | Convolution → Max Pooling → two fully connected layers → Sigmoid |
| **Preprocessing** | Resize, scale RGB values, normalize labels, and zero-center each channel |
| **Default training** | 15 CPU epochs |
| **Saved model** | `models/lego-figure-classifier.dnet` |

## 1. Configure the runtime

```java
int width = 96, height = 96;
int epochs = Integer.getInteger("deepnetts.epochs", 15);
String dataset = "src/main/resources/datasets/lego-people";
System.setProperty("java.awt.headless", "true");
DeepNetts.getInstance().setUseCuda(false);
```

## 2. Load and preprocess the indexed dataset

```java
ImageSet images = ImageData.load(dataset, "train.txt", width, height, false, true);
images.zeroMeanPerChannel();
```

Unlike the other examples, this project preserves the professor's original `train.txt`. It deliberately repeats negative entries to reduce class imbalance. The loader normalizes historical negative-label spellings, resizes RGB images, scales their values, and zero-centers each channel.

## 3. Inspect, shuffle, and split

```java
System.out.println("Images: " + images.size());
System.out.println("Images by class: " + images.countByClasses());
images.shuffle(42);
ImageSet[] split = images.split(0.8, 0.2);
ImageSet trainingSet = split[0];
ImageSet testSet = split[1];
```

Counts describe indexed examples, including intentional repeats from the original dataset.

## 4. Build the CNN

```java
ConvolutionalNetwork network = ConvolutionalNetwork.builder()
        .addInputLayer(width, height, 3)
        .addConvolutionalLayer(12, Filters.ofSize(5), ActivationType.TANH)
        .addMaxPoolingLayer(Filters.ofSize(2).stride(2))
        .addFullyConnectedLayer(30, ActivationType.TANH)
        .addFullyConnectedLayer(10, ActivationType.TANH)
        .addOutputLayer(1, ActivationType.SIGMOID)
        .lossFunction(LossType.CROSS_ENTROPY)
        .randomSeed(42).build();
```

This architecture retains the character of the original example while using the current Deep Netts 4 API.

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
network.save("models/lego-figure-classifier.dnet");
```

The generated `.dnet` file contains the trained network.

## 7. Make a prediction

```java
ExampleImage image = testSet.get(0);
float probability = network.predict(image.getInput()).getValues()[0];
String predicted = probability >= 0.5f ? "legoman" : "negative";
```

The Sigmoid value is the probability that the image contains a Lego figure.

## 8. Release resources

```java
network.getThreadPool().shutdown();
```

The final call stops the network's background worker threads.

## Run in NetBeans

```text
--add-modules=jdk.incubator.vector -Ddeepnetts.epochs=1
```

<div class="github-project-action"><a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/img-classification/lego-figure-recognition">View Example on GitHub</a></div>

<a class="back-button" href="./">← Back to Image Classification Examples</a>
