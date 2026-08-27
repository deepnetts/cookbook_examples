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
| **Preprocessing** | Resize and scale RGB values, then zero-center each channel |
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

Unlike the other examples, this project preserves the professor's original
`train.txt`. It deliberately repeats negative entries to reduce class
imbalance. The loader resizes RGB images, scales their values, and zero-centers
each channel.

## 3. Inspect the images

```java
System.out.println("Images: " + images.size());
System.out.println("Images by class: " + images.countByClasses());
```

<pre class="console-output">Images: 634
Number of images by label/class
negativ : 6
negative : 172
legoman : 456
Images by class: {negativ=6, negative=172, legoman=456}</pre>

Counts describe indexed entries, including intentional repeats. The output also
reveals six historical `negativ` labels in `train.txt`. They are counted
separately from `negative`, so the current loaded dataset contains three label
spellings even though the prediction task is intended to be binary.

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
        .addConvolutionalLayer(12, Filters.ofSize(5), ActivationType.TANH)
        .addMaxPoolingLayer(Filters.ofSize(2).stride(2))
        .addFullyConnectedLayer(30, ActivationType.TANH)
        .addFullyConnectedLayer(10, ActivationType.TANH)
        .addOutputLayer(1, ActivationType.SIGMOID)
        .lossFunction(LossType.CROSS_ENTROPY)
        .randomSeed(42).build();
```

This architecture retains the character of the original example while using the current Deep Netts 4 API.

## 6. Configure and train

```java
network.getTrainer().setStopEpochs(epochs).setLearningRate(0.001f)
        .setOptimizer(OptimizerType.ADAM).setBatchMode(true)
        .setBatchSize(16).setShuffle(true);
network.train(trainingSet);
```

<pre class="console-output">TRAINING NEURAL NETWORK
--------------------------------------------------------------

Initial Train Error:0.6297051
Epoch:1, Time:53197ms, TrainError:0.45970678, TrainErrorChange:-0.16999829, TrainAccuracy:0.7968442

TRAINING COMPLETED
Total Training Time: 59585ms
--------------------------------------------------------------</pre>

!!! warning "Smoke-test output"

    This output was generated with `-Ddeepnetts.epochs=1` for faster training.
    The example uses 15 epochs by default. In NetBeans, add the override under
    **Project Properties → Run → VM Options**.

This one-epoch smoke test reduced training error and reached about 79.7%
training accuracy. A longer run is still needed to assess final model quality.

## 7. Evaluate on held-out images

```java
System.out.println(network.test(testSet));
```

<pre class="console-output">Class: legoman
Total items: 126
True positive:86.0 Number of examples correctly classified as positive
True negative:17.0 Number of examples correctly classified as negative
False positive:18.0 Number of examples incorrectly classified as positive
False negative:5.0 Number of examples incorrectly classified as negative
Accuracy (ACC): 0.8174603 How often is a classifier correct in total (percent of correct classifications)
Precision (PPV): 0.8269231 How often is a classifier correct when it gives positive prediction
Recall: 0.94505495 When it is actually positive class, how often does it give positive prediction
F1 Score: 0.8820513 Harmonic average (balance) of precision and recall
Specificity (TNR): 0.4857143 When it is actually negative class, how often does it give negative prediction
Fall-out (FPR): 0.51428574 How often it gives false positive prediction in total (percent of false positive predictions)
False negative rate (FNR): 0.054945055 How often it gives false negative prediction in total (percent of false negative predictions)</pre>

The model finds most Lego figures, as shown by high recall, but its specificity
is below 0.5 because 18 negative images were incorrectly predicted as
`legoman`. The held-out metrics are more informative than training accuracy.

## 8. Save the model

```java
Files.createDirectories(Path.of("models"));
network.save("models/lego-figure-classifier.dnet");
```

The generated `.dnet` file contains the trained network.

## 9. Make a prediction

```java
ExampleImage image = testSet.get(0);
float probability = network.predict(image.getInput()).getValues()[0];
String predicted = probability >= 0.5f ? "legoman" : "negative";
System.out.println("Actual: " + image.getLabel());
System.out.println("Predicted: " + predicted);
System.out.printf("Lego probability: %.4f%n", probability);
```

<pre class="console-output">Actual: negative
Predicted: legoman
Lego probability: 0.7656</pre>

The Sigmoid output is above the `0.5` threshold, so the model predicts
`legoman`. The actual label is `negative`, making this one of the false
positives reflected in the evaluation report.

## 10. Release resources

```java
network.getThreadPool().shutdown();
```

The final call stops the network's background worker threads.

## Run in NetBeans

```text
--add-modules=jdk.incubator.vector -Ddeepnetts.epochs=1
```

<pre class="console-output">WARNING: Using incubator modules: jdk.incubator.vector</pre>

This one-epoch run completed in about 62 seconds. Timings, metrics, and
probabilities can differ between machines and runs. Remove the epoch override
to use the default 15 epochs.

<div class="github-project-action"><a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/img-classification/lego-figure-recognition">View Example on GitHub</a></div>

<a class="back-button" href="./">← Back to Image Classification Examples</a>
