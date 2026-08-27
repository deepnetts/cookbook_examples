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

## 3. Inspect the images

```java
System.out.println("Images: " + images.size());
System.out.println("Images by class: " + images.countByClasses());
```

**Output:**

<pre class="console-output">Images: 1000
Number of images by label/class
0 : 100
1 : 100
2 : 100
3 : 100
4 : 100
5 : 100
6 : 100
7 : 100
8 : 100
9 : 100
Images by class: {0=100, 1=100, 2=100, 3=100, 4=100, 5=100, 6=100, 7=100, 8=100, 9=100}</pre>

The output confirms that all 1,000 images were loaded and that the source
subset contains exactly 100 examples of every digit.

## 4. Shuffle and split

```java
images.shuffle(42);
ImageSet[] split = images.split(0.8, 0.2);
ImageSet trainingSet = split[0];
ImageSet testSet = split[1];
```

**Output:**

<pre class="console-output">Splitting data set: [0.8, 0.2]</pre>

The balanced source subset ensures every digit is represented equally before the reproducible split.

## 5. Build a multiclass CNN

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

Initial Train Error:2.4201968
Epoch:1, Time:69706ms, TrainError:1.6529562, TrainErrorChange:-0.7672405, TrainAccuracy:0.61522794

TRAINING COMPLETED
Total Training Time: 72606ms
--------------------------------------------------------------</pre>

!!! warning "Smoke-test output"

    This output was generated with `-Ddeepnetts.epochs=1` for faster training.
    The example uses 10 epochs by default. In NetBeans, add the override under
    **Project Properties → Run → VM Options**.

This is a one-epoch smoke test. It verifies the complete training flow, but the
network normally needs more epochs to learn reliable digit features.

## 7. Evaluate on held-out images

```java
System.out.println(network.test(testSet));
```

**Output:**

<pre class="console-output">Class: Macro Average
Total items: 253
True positive:147.0 Number of examples correctly classified as positive
True negative:0.0 Number of examples correctly classified as negative
False positive:53.0 Number of examples incorrectly classified as positive
False negative:53.0 Number of examples incorrectly classified as negative
Accuracy (ACC): 0.5810277 How often is a classifier correct in total (percent of correct classifications)
Precision (PPV): 0.735 How often is a classifier correct when it gives positive prediction
Recall: 0.735 When it is actually positive class, how often does it give positive prediction
F1 Score: 0.735 Harmonic average (balance) of precision and recall
Specificity (TNR): 0.0 When it is actually negative class, how often does it give negative prediction
Fall-out (FPR): 1.0 How often it gives false positive prediction in total (percent of false positive predictions)
False negative rate (FNR): 0.265 How often it gives false negative prediction in total (percent of false negative predictions)</pre>

The report uses macro-averaged multiclass metrics over the held-out images.
These one-epoch results are a functional baseline, not final model accuracy.

## 8. Save the model

```java
Files.createDirectories(Path.of("models"));
network.save("models/mnist-classifier.dnet");
```

This creates a reusable trained MNIST classifier under `models/`.

## 9. Predict a digit

```java
ExampleImage image = testSet.get(0);
float[] probabilities = network.predict(image.getInput()).getValues();
int prediction = maxIndex(probabilities);
System.out.println("Actual digit: " + image.getLabel());
System.out.println("Predicted digit: " + prediction);
System.out.printf("Confidence: %.4f%n", probabilities[prediction]);
```

**Output:**

<pre class="console-output">Actual digit: 7
Predicted digit: 3
Confidence: 0.6999</pre>

`maxIndex` selects the digit with the largest Softmax probability:

```java
private static int maxIndex(float[] values) {
    int max = 0;
    for (int i = 1; i < values.length; i++)
        if (values[i] > values[max]) max = i;
    return max;
}
```

The wrong prediction is expected after only one training epoch and is useful:
confidence describes how certain the model is, not whether it is correct.

## 10. Release resources

```java
network.getThreadPool().shutdown();
```

This stops the worker pool after evaluation and prediction are complete.

## Run in NetBeans

```text
--add-modules=jdk.incubator.vector -Ddeepnetts.epochs=1
```

**Output:**

<pre class="console-output">WARNING: Using incubator modules: jdk.incubator.vector</pre>

One epoch took about 73 seconds in this run. Timings, predictions, confidence,
and metrics can differ between machines and runs. Remove
`-Ddeepnetts.epochs=1` to use the default 10 epochs.

<div class="github-project-action"><a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/img-classification/handwritten-digit-recognition">View Example on GitHub</a></div>

<a class="back-button" href="./">← Back to Image Classification Examples</a>
