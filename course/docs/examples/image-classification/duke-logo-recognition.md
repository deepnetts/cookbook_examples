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
| **Related concepts** | [Machine Learning Basics](../../lectures/01-ml-basics.md), [Neural Networks](../../lectures/02-neural-networks.md), [Backpropagation](../../lectures/05-backpropagation.md), [Deep Netts API](../../lectures/03-deep-netts-api.md), [Model Development](../../lectures/04-model-development.md) |

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

## 3. Inspect the images

```java
System.out.println("Images: " + images.size());
System.out.println("Images by class: " + images.countByClasses());
```

**Output:**

<pre class="console-output">Images: 103
Number of images by label/class
negative : 54
duke : 49
Images by class: {negative=54, duke=49}</pre>

The counts confirm that all indexed images were loaded and show the small class
imbalance before training.

## 4. Shuffle and split

```java
images.shuffle(42);
ImageSet[] split = images.split(0.8, 0.2);
ImageSet trainingSet = split[0];
ImageSet testSet = split[1];
```

**Output:**

<pre class="console-output">Splitting data set: [0.8, 0.2]</pre>

The fixed seed makes the 80/20 split reproducible.

## 5. Build the CNN

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

## 6. Configure and train

```java
network.getTrainer().setStopEpochs(epochs).setLearningRate(0.001f)
        .setOptimizer(OptimizerType.ADAM).setBatchMode(true)
        .setBatchSize(8).setShuffle(true);
network.train(trainingSet);
```

**Output:**

<pre class="console-output">TRAINING NEURAL NETWORK
--------------------------------------------------------------

Initial Train Error:0.7090842
Epoch:1, Time:887ms, TrainError:1.9809157, TrainErrorChange:1.2718315, TrainAccuracy:0.46341464
Epoch:2, Time:1191ms, TrainError:1.0763358, TrainErrorChange:-0.9045799, TrainAccuracy:0.5
Epoch:3, Time:1163ms, TrainError:0.53869295, TrainErrorChange:-0.53764284, TrainAccuracy:0.8902439
Epoch:4, Time:1133ms, TrainError:0.2848395, TrainErrorChange:-0.25385344, TrainAccuracy:0.9390244
Epoch:5, Time:1189ms, TrainError:0.2345894, TrainErrorChange:-0.050250113, TrainAccuracy:1.0

TRAINING COMPLETED
Total Training Time: 6162ms
--------------------------------------------------------------</pre>

ADAM updates the model in shuffled mini-batches of eight images. The falling
training error and rising accuracy show how the model fits the training split.

## 7. Evaluate on held-out images

```java
System.out.println(network.test(testSet));
```

**Output:**

<pre class="console-output">Class: duke
Total items: 20
True positive:10.0 Number of examples correctly classified as positive
True negative:10.0 Number of examples correctly classified as negative
False positive:0.0 Number of examples incorrectly classified as positive
False negative:0.0 Number of examples incorrectly classified as negative
Accuracy (ACC): 1.0 How often is a classifier correct in total (percent of correct classifications)
Precision (PPV): 1.0 How often is a classifier correct when it gives positive prediction
Recall: 1.0 When it is actually positive class, how often does it give positive prediction
F1 Score: 1.0 Harmonic average (balance) of precision and recall
Specificity (TNR): 1.0 When it is actually negative class, how often does it give negative prediction
Fall-out (FPR): 0.0 How often it gives false positive prediction in total (percent of false positive predictions)
False negative rate (FNR): 0.0 How often it gives false negative prediction in total (percent of false negative predictions)</pre>

Metrics use only held-out images. This small dataset is a learning example, not a production benchmark.

## 8. Save the model

```java
Files.createDirectories(Path.of("models"));
network.save("models/duke-logo-classifier.dnet");
```

The `.dnet` file can be loaded later without retraining the network.

## 9. Make a prediction

```java
ExampleImage image = testSet.get(0);
float probability = network.predict(image.getInput()).getValues()[0];
String predicted = probability >= 0.5f ? "duke" : "negative";
System.out.println("Actual: " + image.getLabel());
System.out.println("Predicted: " + predicted);
System.out.printf("Duke probability: %.4f%n", probability);
```

**Output:**

<pre class="console-output">Actual: duke
Predicted: duke
Duke probability: 0.9824</pre>

The `0.5` threshold converts Duke probability into the final binary label.

## 10. Release resources

```java
network.getThreadPool().shutdown();
```

Shutting down the worker pool allows the Java application to exit cleanly.

## Run in NetBeans

Use **Project Properties → Run → VM Options**:

```text
--add-modules=jdk.incubator.vector -Ddeepnetts.epochs=1
```

**Output:**

<pre class="console-output">WARNING: Using incubator modules: jdk.incubator.vector</pre>

One epoch verifies the complete flow; remove the epoch override for the default run.
Exact loss values, timings, probabilities, and evaluation metrics can differ
between runs and machines. Perfect accuracy on this small test split does not
imply production-level performance.

<div class="github-project-action"><a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/img-classification/duke-logo-recognition">View Example on GitHub</a></div>

<a class="back-button" href="./">← Back to Image Classification Examples</a>
