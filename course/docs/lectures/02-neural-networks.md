# Neural Networks

A neural network is a model that transforms input features into predictions through connected layers of simple computational units called neurons.

Despite the name, the main ideas can be understood using familiar programming concepts: numbers enter a function, the function applies parameters and an operation, and a result comes out.

## What does a neuron do?

A neuron receives one or more input values. Each input is multiplied by a **weight**, the weighted values are added together, and a **bias** is added:

```text
weighted sum = x1*w1 + x2*w2 + ... + xn*wn + bias
```

Where:

- `x1 ... xn` are input values,
- `w1 ... wn` are weights,
- `bias` is an additional adjustable value.

The weights determine how strongly each input affects the result. The bias allows the neuron to shift its output independently of the input values.

During training, the neural network learns useful values for its weights and biases from the training data.

## Activation functions

After calculating the weighted sum, a neuron usually applies an **activation function**:

```text
inputs -> weighted sum + bias -> activation -> output
```

The activation function determines how the neuron transforms its calculated value.

Common activation functions include:

| Activation | Typical role |
|---|---|
| Linear | Predicting an unrestricted numerical value |
| ReLU | Learning non-linear patterns in hidden layers |
| Sigmoid | Producing a value between `0` and `1` |

Without non-linear activation functions in hidden layers, stacking several layers would still behave like a single linear transformation. Non-linearity allows a network to learn more complex relationships.

## Layers

Neurons are organized into layers.

### Input layer

The input layer receives the feature values. It does not make a prediction by itself; it defines what data enters the network.

For the spam example, the input layer receives five features:

```text
num_links
num_words
has_offer
sender_score
all_caps
```

### Hidden layers

Hidden layers transform information between the input and output layers. A network can have no hidden layers, one hidden layer, or several hidden layers.

Each hidden layer can learn combinations of patterns from the preceding layer. Deeper or wider networks can represent more complex relationships, but they also introduce more parameters and may require more data and careful training.

### Output layer

The output layer produces the final prediction. Its size and activation function depend on the problem.

For example:

```text
Regression            -> one linear output
Binary classification -> one sigmoid output
```

## A linear regression network

The computer hardware example uses this architecture:

```text
6 -> 1
```

It has six input features, no hidden layers, and one linear output:

```text
MYCT  ----\
MMIN  -----\
MMAX  ------\
CACH  -------+-> LINEAR OUTPUT -> predicted PRP
CHMIN ------/
CHMAX -----/
```

Because the network has no hidden layers and uses a linear output, it learns a weighted linear combination of the six features. This is multiple linear regression represented with the Deep Netts neural-network API.

[View the complete `6 -> 1` regression network on GitHub](https://github.com/deepnetts/cookbook-examples/blob/main/examples/linear-regression/src/main/java/com/deepnetts/examples/linearregression/LinearRegressionDeepNetts.java)

## A binary classification network

The spam example uses this architecture:

```text
5 -> 32 -> 16 -> 1
```

It contains:

- five input values,
- a hidden layer with 32 neurons,
- a hidden layer with 16 neurons,
- one Sigmoid output.

The data flows forward through the network:

```text
5 input features
       |
       v
32 hidden neurons (ReLU)
       |
       v
16 hidden neurons (ReLU)
       |
       v
1 output neuron (Sigmoid)
       |
       v
spam probability
```

The hidden layers allow the model to learn non-linear combinations of email characteristics. The Sigmoid output produces a value between `0` and `1`, which can be interpreted as a spam probability.

[View the complete `5 -> 32 -> 16 -> 1` classification network on GitHub](https://github.com/deepnetts/cookbook-examples/blob/main/examples/spam-classification/src/main/java/com/deepnetts/examples/spamclassificationdeepnetts/SpamClassificationDeepNetts.java)

## Architecture is part of model design

A notation such as:

```text
5 -> 32 -> 16 -> 1
```

describes the number of neurons in each layer, from input to output.

Choosing an architecture involves decisions such as:

- how many input features the dataset contains,
- whether the problem needs hidden layers,
- how many neurons each hidden layer should contain,
- which activation functions to use,
- how many outputs the prediction requires.

There is no single best architecture for every dataset. A useful approach is to begin with the smallest model that matches the problem, evaluate it, and increase complexity only when the evidence supports doing so.

## From architecture to training

Defining layers creates the structure of a neural network, but it does not make the network useful by itself. Its initial weights and biases do not yet represent the patterns in the dataset.

Training repeatedly:

1. sends samples through the network,
2. compares predictions with known targets,
3. measures the error using a loss function,
4. adjusts weights and biases to reduce that error.

The next lessons will connect these concepts to the Deep Netts API and the complete model-development workflow.
