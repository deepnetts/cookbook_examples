# Neural Networks

A neural network is a model that transforms input features into a prediction. Before looking at individual neurons and equations, it is more useful to understand the network as a complete system.

For a Java developer, the high-level idea resembles a processing pipeline:

```text
input data -> model -> output
```

The model has an expected input structure, performs a sequence of transformations, and returns a result. Training determines the internal parameters used by those transformations.

## Complete prediction flow

Consider the email spam example. One email is represented by five numerical features:

```text
num_links
num_words
has_offer
sender_score
all_caps
```

The complete prediction flow is:

```text
email features
      |
      v
neural network
      |
      v
spam probability
      |
      v
SPAM or NOT SPAM
```

At this level, the network can be treated as a function:

```text
five input values -> one output value
```

The output is a number between `0` and `1`. A threshold such as `0.5` converts it into a class.

This input-to-output contract is the first thing to understand. The internal structure explains how the model performs the transformation.

## Read the architecture

The spam network has this architecture:

```text
5 -> 32 -> 16 -> 1
```

Each number describes the size of one layer:

- `5` input values,
- `32` neurons in the first hidden layer,
- `16` neurons in the second hidden layer,
- `1` output value.

Data flows forward through the complete network:

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

The notation provides a compact system-level view before we inspect what happens inside each layer.

[Full Spam Classification on GitHub](https://github.com/deepnetts/cookbook-examples/tree/main/examples/spam-classification)

## Layer responsibilities

A feed-forward network organizes its transformations into layers.

### Input layer: define the model contract

The input layer receives feature values. Its size must match the number of features supplied for each sample.

In the spam example, five dataset columns become five network inputs. The feature order is part of the contract: changing the order changes the meaning of the data.

### Hidden layers: transform representations

Hidden layers sit between the input and output. Each hidden layer receives values from the preceding layer and produces a new representation for the following layer.

The spam network uses layers of 32 and 16 neurons. These layers allow the model to learn non-linear combinations of email characteristics. A pattern may depend on several features together rather than on one feature alone.

A network can have no hidden layers, one hidden layer, or several hidden layers. More layers and neurons create more trainable parameters and greater capacity, but they may also require more data and careful training.

### Output layer: match the prediction task

The output layer returns the final prediction. Its structure depends on the problem:

```text
Regression            -> one linear output
Binary classification -> one sigmoid output
```

The spam classifier uses one Sigmoid output because it predicts the probability of one positive class: spam.

## Compare network designs

The two projects demonstrate how architecture follows the prediction problem.

### Binary classification: `5 -> 32 -> 16 -> 1`

The spam classifier contains hidden layers because it is intended to learn non-linear relationships between email features.

```text
email characteristics -> hidden transformations -> spam probability
```

### Linear regression: `6 -> 1`

The computer hardware example uses six inputs, no hidden layers, and one linear output:

```text
MYCT  ----\
MMIN  -----\
MMAX  ------\
CACH  -------+-> LINEAR OUTPUT -> predicted PRP
CHMIN ------/
CHMAX -----/
```

Because there are no hidden layers, the model learns a weighted linear combination of the six features. This is multiple linear regression represented with the Deep Netts neural-network API.

[Full Multiple Linear Regression on GitHub](https://github.com/deepnetts/cookbook-examples/tree/main/examples/multiple-linear-regression)

At the system level, both models have the same responsibility:

```text
features -> learned transformation -> prediction
```

They differ in their internal structure because they solve different kinds of problems.

## Inside one neuron

After understanding the network and its layers, we can inspect the smallest computational unit.

A neuron receives values from the preceding layer. Each value is multiplied by a **weight**, the weighted values are added, and a **bias** is included:

```text
weighted sum = x1*w1 + x2*w2 + ... + xn*wn + bias
```

Where:

- `x1 ... xn` are values entering the neuron,
- `w1 ... wn` are trainable weights,
- `bias` is an additional trainable value.

The weights control how strongly each incoming value affects the result. The bias allows the neuron to shift its result independently of those inputs.

One neuron performs a small calculation. A layer performs many such calculations, and the network composes the transformations of all its layers.

## Activation functions

After calculating its weighted sum, a neuron usually applies an **activation function**:

```text
inputs -> weighted sum + bias -> activation -> output
```

Common activation functions have different responsibilities:

| Activation | Typical role |
|---|---|
| Linear | Predicting an unrestricted numerical value |
| ReLU | Learning non-linear patterns in hidden layers |
| Sigmoid | Producing a value between `0` and `1` |

The spam network uses ReLU in its hidden layers and Sigmoid in its output layer. The regression network uses a Linear output.

Without non-linear activation functions in hidden layers, stacking several layers would still behave like a single linear transformation. Non-linearity allows hidden layers to represent more complex relationships.

## How training works

Defining the architecture creates an untrained network. Its initial weights and biases do not yet represent useful patterns in the dataset.

Training repeatedly performs this high-level loop:

```text
input samples
      |
      v
forward prediction
      |
      v
compare with known targets
      |
      v
measure loss
      |
      v
adjust weights and biases
```

In more specific terms, training:

1. sends samples forward through the complete network,
2. compares predictions with known targets,
3. measures the error using a loss function,
4. uses backpropagation and an optimizer to adjust parameters.

The network architecture remains the same during this process. What changes are the learned weights and biases inside its neurons.

## Architecture decisions

Choosing an architecture involves deciding:

- how many input features the model receives,
- whether the problem needs hidden layers,
- how many neurons each hidden layer contains,
- which activation functions match each layer's role,
- how many outputs the prediction requires.

There is no single best architecture for every dataset. Begin with the smallest model that matches the problem, evaluate it, and increase complexity only when the evidence supports doing so.

The important top-down questions are:

```text
What enters the model?
What should it predict?
Which layers transform the data?
What does each neuron do inside those layers?
How does training improve the complete system?
```

## Continue learning

Now connect the network, layers, neurons, and training process to the Java classes and methods used to implement them.
