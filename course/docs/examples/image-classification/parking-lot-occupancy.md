[View Example on GitHub](https://github.com/deepnetts/cookbook-examples/tree/main/examples/img-classification/parking-lot-occupancy)

# Parking Lot Occupancy

This walkthrough trains a CNN to recognize whether a cropped parking space is occupied or free.

**Problem:** Classify a parking-space image as occupied (`busy`) or free (`negative`).

**Dataset:** 6,171 labeled image patches: 3,621 occupied spaces and 2,550 free spaces.

## At a glance

| | |
|---|---|
| **ML task** | Binary image classification |
| **Input** | `48 × 48 × 3` RGB image |
| **Target** | `busy` or `negative` |
| **Model** | Convolution → Max Pooling → Fully Connected → Sigmoid |
| **Preprocessing** | Resize to `48 × 48` and scale RGB values while loading |
| **Default training** | 3 CPU epochs |
| **Saved model** | `models/parking-occupancy.dnet` |

## 1. Configure and load

```java
int width = 48, height = 48;
int epochs = Integer.getInteger("deepnetts.epochs", 3);
String dataset = "src/main/resources/datasets/parking-lot";
System.setProperty("java.awt.headless", "true");
DeepNetts.getInstance().setUseCuda(false);
ImageSet images = ImageData.load(dataset, "index.txt", width, height, false, false);
```

The shared loader validates and resizes all 6,171 RGB images. The lower default epoch count reflects the larger dataset.

## 2. Inspect, shuffle, and split

```java
System.out.println("Images: " + images.size());
System.out.println("Images by class: " + images.countByClasses());
images.shuffle(42);
ImageSet[] split = images.split(0.8, 0.2);
ImageSet trainingSet = split[0];
ImageSet testSet = split[1];
```

## 3. Build the CNN

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

## 4. Train and evaluate

```java
network.getTrainer().setStopEpochs(epochs).setLearningRate(0.001f)
        .setOptimizer(OptimizerType.ADAM).setBatchMode(true)
        .setBatchSize(32).setShuffle(true);
network.train(trainingSet);
System.out.println(network.test(testSet));
```

One CPU epoch may take roughly 45 seconds depending on the machine. Output can pause until the epoch finishes.

## 5. Save the model

```java
Files.createDirectories(Path.of("models"));
network.save("models/parking-occupancy.dnet");
```

The saved network can be reused without repeating training.

## 6. Make a prediction

```java
ExampleImage image = testSet.get(0);
float probability = network.predict(image.getInput()).getValues()[0];
String predicted = probability >= 0.5f ? "busy" : "negative";
```

The threshold converts occupied-space probability into `busy` or `negative`.

## 7. Release resources

```java
network.getThreadPool().shutdown();
```

This stops the worker pool so the application terminates normally.

## Run in NetBeans

```text
--add-modules=jdk.incubator.vector -Ddeepnetts.epochs=1
```

One epoch still runs loading, training, evaluation, saving, and prediction over the full dataset.

<div class="github-project-action"><a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/img-classification/parking-lot-occupancy">View Example on GitHub</a></div>

<a class="back-button" href="./">← Back to Image Classification Examples</a>
