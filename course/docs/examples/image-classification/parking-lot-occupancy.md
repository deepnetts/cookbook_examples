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

## 1. Configure the runtime

```java
int width = 48, height = 48;
int epochs = Integer.getInteger("deepnetts.epochs", 3);
String dataset = "src/main/resources/datasets/parking-lot";
System.setProperty("java.awt.headless", "true");
DeepNetts.getInstance().setUseCuda(false);
```

The lower default epoch count reflects the larger dataset.

## 2. Load and preprocess

```java
ImageSet images = ImageData.load(dataset, "index.txt", width, height, false, false);
```

The shared loader validates and resizes all 6,171 RGB images to `48 × 48`.

## 3. Inspect the images

```java
System.out.println("Images: " + images.size());
System.out.println("Images by class: " + images.countByClasses());
```

**Output:**

<pre class="console-output">Images: 6171
Number of images by label/class
negative : 2550
busy : 3621
Images by class: {negative=2550, busy=3621}</pre>

The output confirms that all indexed images were loaded. The dataset contains
1,071 more occupied spaces than free spaces.

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

The compact architecture keeps CPU training practical for the larger image
dataset. Its Sigmoid output represents occupied-space probability.

## 6. Configure and train

```java
network.getTrainer().setStopEpochs(epochs).setLearningRate(0.001f)
        .setOptimizer(OptimizerType.ADAM).setBatchMode(true)
        .setBatchSize(32).setShuffle(true);
network.train(trainingSet);
```

**Output:**

<pre class="console-output">TRAINING NEURAL NETWORK
--------------------------------------------------------------

Initial Train Error:0.6700583
Epoch:1, Time:40277ms, TrainError:0.40303913, TrainErrorChange:-0.26701918, TrainAccuracy:0.8547407

TRAINING COMPLETED
Total Training Time: 46010ms
--------------------------------------------------------------</pre>

!!! warning "Smoke-test output"

    This output was generated with `-Ddeepnetts.epochs=1` for faster training.
    The example uses 3 epochs by default. In NetBeans, add the override under
    **Project Properties → Run → VM Options**.

One CPU epoch took about 46 seconds in this run. The falling error and 85.5%
training accuracy show that the model learned useful patterns, but held-out
evaluation is needed to judge generalization.

## 7. Evaluate on held-out images

```java
System.out.println(network.test(testSet));
```

**Output:**

<pre class="console-output">Class: busy
Total items: 1234
True positive:738.0 Number of examples correctly classified as positive
True negative:336.0 Number of examples correctly classified as negative
False positive:154.0 Number of examples incorrectly classified as positive
False negative:6.0 Number of examples incorrectly classified as negative
Accuracy (ACC): 0.87034035 How often is a classifier correct in total (percent of correct classifications)
Precision (PPV): 0.82735425 How often is a classifier correct when it gives positive prediction
Recall: 0.9919355 When it is actually positive class, how often does it give positive prediction
F1 Score: 0.9022005 Harmonic average (balance) of precision and recall
Specificity (TNR): 0.6857143 When it is actually negative class, how often does it give negative prediction
Fall-out (FPR): 0.31428573 How often it gives false positive prediction in total (percent of false positive predictions)
False negative rate (FNR): 0.008064516 How often it gives false negative prediction in total (percent of false negative predictions)</pre>

The model detects almost every occupied space, as shown by 99.2% recall and
only six false negatives. Its 154 false positives and lower specificity show
that free spaces are still harder to classify after one epoch.

## 8. Save the model

```java
Files.createDirectories(Path.of("models"));
network.save("models/parking-occupancy.dnet");
```

The saved network can be reused without repeating training.

## 9. Make a prediction

```java
ExampleImage image = testSet.get(0);
float probability = network.predict(image.getInput()).getValues()[0];
String predicted = probability >= 0.5f ? "busy" : "negative";
System.out.println("Actual: " + image.getLabel());
System.out.println("Predicted: " + predicted);
System.out.printf("Occupied probability: %.4f%n", probability);
```

**Output:**

<pre class="console-output">Actual: busy
Predicted: busy
Occupied probability: 0.9958</pre>

The probability is well above the `0.5` threshold, so this held-out occupied
space is correctly classified as `busy`.

## 10. Release resources

```java
network.getThreadPool().shutdown();
```

This stops the worker pool so the application terminates normally.

## Run in NetBeans

```text
--add-modules=jdk.incubator.vector -Ddeepnetts.epochs=1
```

**Output:**

<pre class="console-output">WARNING: Using incubator modules: jdk.incubator.vector</pre>

One epoch still runs loading, training, evaluation, saving, and prediction over
the full dataset. This run completed in about 58 seconds. Timings, metrics, and
probabilities can differ between machines and runs; remove the override to use
the default three epochs.

<div class="github-project-action"><a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/img-classification/parking-lot-occupancy">View Example on GitHub</a></div>

<a class="back-button" href="./">← Back to Image Classification Examples</a>
