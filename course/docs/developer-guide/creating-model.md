# Creating a Model

Build a network whose input count matches the feature columns and whose output layer, activation, and loss match the prediction task.

## Regression

Use a linear output for predicting a continuous numerical value:

```java
import deepnetts.net.FeedForwardNetwork;
import deepnetts.net.layers.activation.ActivationType;
import deepnetts.net.loss.LossType;

FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
        .addInputLayer(NUM_INPUTS)
        .addOutputLayer(1, ActivationType.LINEAR)
        .lossFunction(LossType.MEAN_SQUARED_ERROR)
        .randomSeed(42)
        .build();
```

This is the smallest linear regression model. Add hidden layers only when the problem requires a nonlinear relationship.

## Binary classification

Use one Sigmoid output to produce a value between zero and one:

```java
FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
        .addInputLayer(NUM_INPUTS)
        .addFullyConnectedLayer(32)
        .addFullyConnectedLayer(16)
        .addOutputLayer(1, ActivationType.SIGMOID)
        .lossFunction(LossType.CROSS_ENTROPY)
        .randomSeed(42)
        .build();
```

Interpret the output as a class probability and apply an explicit threshold when choosing the class.

## Multiclass classification

Use one Softmax output per class:

```java
FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
        .addInputLayer(NUM_INPUTS)
        .addFullyConnectedLayer(16, ActivationType.TANH)
        .addOutputLayer(NUM_CLASSES, ActivationType.SOFTMAX)
        .lossFunction(LossType.CROSS_ENTROPY)
        .randomSeed(42)
        .build();
```

The order of the outputs must match the order of the one-hot target columns and the class-name mapping used during prediction.

## Convolutional Neural Network

Use `ConvolutionalNetwork` when the input has spatial structure, such as an
image. Convolutional layers learn local patterns, pooling reduces spatial
dimensions, and fully connected layers combine the learned feature maps before
classification.

<figure class="course-figure">
  <img src="../../assets/course-figures/cnn-architecture.svg" alt="CNN architecture from image input through convolution, pooling, dense layers, and a binary or multiclass classification output">
  <figcaption>A CNN preserves image structure while extracting features, then uses a task-specific output layer for the final prediction.</figcaption>
</figure>

A compact binary image classifier can be built with the current Deep Netts API:

```java
import deepnetts.net.ConvolutionalNetwork;
import deepnetts.net.layers.Filters;
import deepnetts.net.layers.activation.ActivationType;
import deepnetts.net.loss.LossType;

ConvolutionalNetwork network = ConvolutionalNetwork.builder()
        .addInputLayer(width, height, 3)
        .addConvolutionalLayer(6, Filters.ofSize(3))
        .addMaxPoolingLayer(2, 2)
        .addFullyConnectedLayer(16)
        .addOutputLayer(1, ActivationType.SIGMOID)
        .hiddenActivationFunction(ActivationType.LEAKY_RELU)
        .lossFunction(LossType.CROSS_ENTROPY)
        .randomSeed(42)
        .build();
```

| Builder step | Responsibility |
|---|---|
| `addInputLayer(width, height, 3)` | Declares RGB image dimensions and channels |
| `addConvolutionalLayer(6, Filters.ofSize(3))` | Learns six local `3 × 3` filters |
| `addMaxPoolingLayer(2, 2)` | Reduces feature-map width and height |
| `addFullyConnectedLayer(16)` | Combines extracted spatial features |
| `addOutputLayer(1, SIGMOID)` | Produces one binary-class probability |

For grayscale input, use one channel. For multiclass classification, use one
Softmax output per class:

```java
.addInputLayer(width, height, 1)
// convolution, pooling, and fully connected layers
.addOutputLayer(NUM_CLASSES, ActivationType.SOFTMAX)
.lossFunction(LossType.CROSS_ENTROPY)
```

The output order must remain identical to the class-label mapping used by the
dataset and prediction code. Add another convolution-and-pooling block only
when the image size and problem complexity justify the additional capacity.

## Check the dimensions

- Input neurons must equal the number of feature columns.
- Regression usually has one linear output per numerical target.
- Binary classification uses one Sigmoid output in the current examples.
- Multiclass classification uses one Softmax output per class.
- A CNN input must match image width, height, and channel count exactly.
- A binary CNN uses one Sigmoid output; a multiclass CNN uses one Softmax output per class.

Use a fixed random seed when you want reproducible weight initialization while comparing changes.

??? info "See it in practice"
    - [Logistic Regression](../examples/classification/sonar-rock-mine-classification.md) uses no hidden layers and connects 60 inputs directly to one Sigmoid output.
    - [Spam Classification](../examples/classification/email-spam-detection.md) adds two hidden layers for a nonlinear binary classifier.
    - [Hot Dog or Not Hot Dog](../examples/image-classification/hotdog-nothotdog.md) uses convolution and pooling before a binary Sigmoid output.
    - [Credit Card Fraud Detection](../examples/classification/credit-card-fraud-detection.md) uses two hidden layers and one Sigmoid fraud-probability output.
    - [Insurance Payment Prediction](../examples/regression/insurance-payment-prediction.md) uses a minimal `1 -> 1` linear model.
    - [House Price Prediction](../examples/regression/house-price-prediction.md) adds hidden layers for nonlinear regression.
