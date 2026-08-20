[View Example on GitHub](https://github.com/deepnetts/cookbook-examples/tree/main/examples/img-classification/handwritten-digit-recognition)

# Handwritten Digit Recognition

This walkthrough trains a multiclass CNN to recognize handwritten digits from `0` to `9`.

**Problem:** Classify a handwritten digit as one of ten classes from `0` to `9`.

**Dataset:** A balanced 1,000-image MNIST subset containing 100 images for each digit.

## At a glance

| | |
|---|---|
| **ML task** | Multiclass image classification |
| **Input** | `28 × 28 × 1` grayscale image |
| **Target** | One digit from `0` to `9` |
| **Model** | Two convolution/pooling blocks → two fully connected layers → 10-class Softmax |
| **Preprocessing** | Resize to `28 × 28`, convert to grayscale, and invert intensity |
| **Default training** | 10 CPU epochs |
| **Saved model** | `models/mnist-classifier.dnet` |

## 1. Configure the runtime

```java
int width = 28, height = 28;
int epochs = Integer.getInteger("deepnetts.epochs", 10);
String dataset = "src/main/resources/datasets/mnist";
System.setProperty("java.awt.headless", "true");
DeepNetts.getInstance().setUseCuda(false);
```

## 2. Load and preprocess MNIST

```java
ImageSet images = ImageData.load(dataset, "index.txt", width, height, true, true);
```

The final two arguments convert the image to one grayscale channel and invert its intensity. This makes bright digit strokes appear on a dark background in the representation used by the network.

## 3. Inspect, shuffle, and split

```java
System.out.println("Images: " + images.size());
System.out.println("Images by class: " + images.countByClasses());
images.shuffle(42);
ImageSet[] split = images.split(0.8, 0.2);
ImageSet trainingSet = split[0];
ImageSet testSet = split[1];
```

The balanced source subset ensures every digit is represented equally before the reproducible split.

## 4. Build a multiclass CNN

```java
ConvolutionalNetwork network = ConvolutionalNetwork.builder()
        .addInputLayer(width, height, 1)
        .addConvolutionalLayer(12, Filters.ofSize(5))
        .addMaxPoolingLayer(2, 2)
        .addConvolutionalLayer(24, Filters.ofSize(5))
        .addMaxPoolingLayer(2, 2)
        .addFullyConnectedLayer(60)
        .addFullyConnectedLayer(60)
        .addOutputLayer(10, ActivationType.SOFTMAX)
        .hiddenActivationFunction(ActivationType.RELU)
        .lossFunction(LossType.CROSS_ENTROPY)
        .randomSeed(42).build();
```

The two convolution/pooling blocks learn increasingly complex stroke shapes. Softmax produces one probability for every digit.

## 5. Train and evaluate

```java
network.getTrainer().setStopEpochs(epochs).setLearningRate(0.001f)
        .setOptimizer(OptimizerType.ADAM).setBatchMode(true)
        .setBatchSize(32).setShuffle(true);
network.train(trainingSet);
System.out.println(network.test(testSet));
```

## 6. Save the model

```java
Files.createDirectories(Path.of("models"));
network.save("models/mnist-classifier.dnet");
```

This creates a reusable trained MNIST classifier under `models/`.

## 7. Predict a digit

```java
ExampleImage image = testSet.get(0);
float[] probabilities = network.predict(image.getInput()).getValues();
int prediction = maxIndex(probabilities);
System.out.printf("Confidence: %.4f%n", probabilities[prediction]);
```

`maxIndex` selects the digit with the largest Softmax probability.

## 8. Release resources

```java
network.getThreadPool().shutdown();
```

This stops the worker pool after evaluation and prediction are complete.

## Run in NetBeans

```text
--add-modules=jdk.incubator.vector -Ddeepnetts.epochs=1
```

<div class="github-project-action"><a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/img-classification/handwritten-digit-recognition">View Example on GitHub</a></div>

<a class="back-button" href="./">← Back to Image Classification Examples</a>
