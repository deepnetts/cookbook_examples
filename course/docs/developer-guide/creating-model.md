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

## Check the dimensions

- Input neurons must equal the number of feature columns.
- Regression usually has one linear output per numerical target.
- Binary classification uses one Sigmoid output in the current examples.
- Multiclass classification uses one Softmax output per class.

Use a fixed random seed when you want reproducible weight initialization while comparing changes.

??? info "See it in practice"
    - [Logistic Regression](../examples/classification/logistic-regression.md) uses no hidden layers and connects 60 inputs directly to one Sigmoid output.
    - [Spam Classification](../examples/classification/spam-classification.md) adds two hidden layers for a nonlinear binary classifier.
    - [Hot Dog or Not Hot Dog](../examples/image-classification/hotdog-nothotdog.md) uses convolution and pooling before a binary Sigmoid output.
