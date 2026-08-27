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

## 3. Inspect the images

```java
System.out.println("Images: " + images.size());
System.out.println("Images by class: " + images.countByClasses());
```

<pre class="console-output">Images: 467
Number of images by label/class
negative : 228
hot_dog : 239
Images by class: {negative=228, hot_dog=239}</pre>

The output confirms that all 467 indexed images were loaded. The two classes
are close to balanced before the split.

## 4. Shuffle and split

```java
images.shuffle(42);
ImageSet[] split = images.split(0.8, 0.2);
ImageSet trainingSet = split[0];
ImageSet testSet = split[1];
```

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

The convolution and pooling layers learn local image patterns. The Sigmoid
output represents the probability that an image belongs to the `hot_dog`
class.

## 6. Configure and train

```java
network.getTrainer().setStopEpochs(epochs).setLearningRate(0.001f)
        .setOptimizer(OptimizerType.ADAM).setBatchMode(true)
        .setBatchSize(16).setShuffle(true);
network.train(trainingSet);
```

<pre class="console-output">TRAINING NEURAL NETWORK
--------------------------------------------------------------

Initial Train Error:0.6913408
Epoch:1, Time:4144ms, TrainError:0.90619606, TrainErrorChange:0.21485525, TrainAccuracy:0.5227882

TRAINING COMPLETED
Total Training Time: 4907ms
--------------------------------------------------------------</pre>

!!! warning "Smoke-test output"

    This output was generated with `-Ddeepnetts.epochs=1` for faster training.
    The example uses 10 epochs by default. In NetBeans, add the override under
    **Project Properties → Run → VM Options**.

This run uses one epoch as a smoke test. The training error increased and
training accuracy stayed near chance level, so the model has not converged.

## 7. Evaluate on held-out images

```java
System.out.println(network.test(testSet));
```

<pre class="console-output">Class: hot_dog
Total items: 93
True positive:50.0 Number of examples correctly classified as positive
True negative:3.0 Number of examples correctly classified as negative
False positive:40.0 Number of examples incorrectly classified as positive
False negative:0.0 Number of examples incorrectly classified as negative
Accuracy (ACC): 0.56989247 How often is a classifier correct in total (percent of correct classifications)
Precision (PPV): 0.5555556 How often is a classifier correct when it gives positive prediction
Recall: 1.0 When it is actually positive class, how often does it give positive prediction
F1 Score: 0.71428573 Harmonic average (balance) of precision and recall
Specificity (TNR): 0.069767445 When it is actually negative class, how often does it give negative prediction
Fall-out (FPR): 0.9302326 How often it gives false positive prediction in total (percent of false positive predictions)
False negative rate (FNR): 0.0 How often it gives false negative prediction in total (percent of false negative predictions)</pre>

The one-epoch model found every held-out hot-dog image, which gives it perfect
recall, but incorrectly labeled 40 negative images as hot dogs. The low
specificity and high fall-out show why recall alone is not enough to judge this
classifier.

## 8. Save the model

```java
Files.createDirectories(Path.of("models"));
network.save("models/hotdog-classifier.dnet");
```

The saved model is the reusable result of training.

## 9. Make a prediction

```java
ExampleImage image = testSet.get(0);
float probability = network.predict(image.getInput()).getValues()[0];
String predicted = probability >= 0.5f ? "hot_dog" : "negative";
System.out.println("Actual: " + image.getLabel());
System.out.println("Predicted: " + predicted);
System.out.printf("Hot-dog probability: %.4f%n", probability);
```

<pre class="console-output">Actual: hot_dog
Predicted: hot_dog
Hot-dog probability: 0.6097</pre>

The probability is above the `0.5` threshold, so this held-out image is
classified as `hot_dog`. This prediction is correct, although the evaluation
above shows that the one-epoch model is not yet reliable.

## 10. Release resources

```java
network.getThreadPool().shutdown();
```

This safely stops the network's background worker threads.

## Run in NetBeans

```text
--add-modules=jdk.incubator.vector -Ddeepnetts.epochs=1
```

<pre class="console-output">WARNING: Using incubator modules: jdk.incubator.vector</pre>

One epoch is a complete functional smoke test, not a final accuracy run. This
run completed in about 12 seconds. Timings, metrics, and probabilities can
differ between machines and runs; remove the epoch override to use the default
10 epochs.

<div class="github-project-action"><a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/img-classification/hotdog-nothotdog">View Example on GitHub</a></div>

<a class="back-button" href="./">← Back to Image Classification Examples</a>
