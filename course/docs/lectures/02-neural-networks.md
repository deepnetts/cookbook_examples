# Neural Networks

A neural network is a model that transforms input features into a prediction. Before looking at individual neurons and equations, it is more useful to understand the network as a complete system.

For a Java developer, the high-level idea resembles a processing pipeline:

<figure class="course-figure">
  <img src="../../assets/course-figures/neural-network-pipeline.svg" alt="Input feature data passing through a neural network model to produce an output prediction">
  <figcaption>A neural network receives a defined set of feature values, applies its learned transformations, and returns a prediction.</figcaption>
</figure>

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

<figure class="course-figure">
  <img src="../../assets/course-figures/neural-network-architecture.svg" alt="Five email features passing through two hidden layers to a spam-probability output">
  <figcaption>The architecture describes both the input contract and the transformations that lead to one Sigmoid probability.</figcaption>
</figure>

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

Data flows forward through the complete network shown above: from five input features, through `32` and `16` ReLU hidden neurons, to one Sigmoid probability.

The notation provides a compact system-level view before we inspect what happens inside each layer.

## Layer responsibilities

A feed-forward network organizes its transformations into layers.

<figure class="course-figure">
  <img src="../../assets/course-figures/network-layer-responsibilities.svg" alt="A feed-forward neural network divided into an input layer, hidden layers, and an output layer">
  <figcaption>The input layer defines what enters the model, hidden layers learn useful transformations, and the output layer returns the prediction.</figcaption>
</figure>

### Input layer: define the model contract

The input layer receives feature values. Its size must match the number of features supplied for each sample.

In the spam example, five dataset columns become five network inputs. The feature order is part of the contract: changing the order changes the meaning of the data.

### Hidden layers: transform representations

Hidden layers sit between the input and output. Each hidden layer receives values from the preceding layer and produces a new representation for the following layer.

The spam network uses layers of 32 and 16 neurons. These layers allow the model to learn non-linear combinations of email characteristics. A pattern may depend on several features together rather than on one feature alone.

A network can have no hidden layers, one hidden layer, or several hidden layers. More layers and neurons create more trainable parameters and greater capacity, but they may also require more data and careful training.

The [Logistic Regression](03-logistic-regression.md) lesson demonstrates the zero-hidden-layer case with the runnable [Sonar walkthrough](../examples/classification/sonar-rock-mine-classification.md). Its `60 -> 1` architecture learns a linear decision boundary, while the Spam network uses hidden layers to learn non-linear feature combinations.

### Output layer: match the prediction task

The output layer returns the final prediction. Its structure depends on the problem:

<figure class="course-figure">
  <img src="../../assets/course-figures/output-layer-by-task.svg" alt="Regression mapped to one Linear output, binary classification to one Sigmoid output, and multiclass classification to one Softmax output per class">
  <figcaption>The prediction task determines the output size and activation function.</figcaption>
</figure>

The spam classifier uses one Sigmoid output because it predicts the probability of one positive class: spam.

The Iris classifier uses three Softmax outputs. Together they represent the probabilities of `SETOSA`, `VERSICOLOR`, and `VIRGINICA`.

## Compare network designs

These four examples demonstrate how architecture follows the prediction problem.

<div class="classification-comparison architecture-comparison" role="region" aria-label="Neural network architecture comparison" tabindex="0">
  <table>
    <thead>
      <tr>
        <th scope="col">Problem</th>
        <th scope="col">Example</th>
        <th scope="col">Features</th>
        <th scope="col">Architecture</th>
        <th scope="col">Output</th>
        <th scope="col">Walkthrough</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Binary classification</strong></td>
        <td>Spam classifier</td>
        <td>5 email features</td>
        <td><code>5 → 32 → 16 → 1</code></td>
        <td>1 Sigmoid probability</td>
        <td><a href="../../examples/classification/email-spam-detection/" target="_blank" rel="noopener">View example →</a></td>
      </tr>
      <tr>
        <td><strong>Multiclass classification</strong></td>
        <td>Iris classifier</td>
        <td>4 flower measurements</td>
        <td><code>4 → 16 → 3</code></td>
        <td>3 Softmax probabilities</td>
        <td><a href="../../examples/classification/iris-flower-classification/" target="_blank" rel="noopener">View example →</a></td>
      </tr>
      <tr>
        <td><strong>Image classification</strong></td>
        <td>Hot Dog classifier</td>
        <td>RGB image pixels</td>
        <td><code>convolution → pooling → fully connected</code></td>
        <td>1 Sigmoid probability</td>
        <td><a href="../../examples/image-classification/hotdog-nothotdog/" target="_blank" rel="noopener">View example →</a></td>
      </tr>
      <tr>
        <td><strong>Multiple linear regression</strong></td>
        <td>Computer Hardware predictor</td>
        <td>6 hardware features</td>
        <td><code>6 → 1</code></td>
        <td>1 Linear value</td>
        <td><a href="../../examples/regression/computer-hardware-performance-prediction/" target="_blank" rel="noopener">View example →</a></td>
      </tr>
    </tbody>
  </table>
</div>

At the system level, all of these models have the same responsibility:

<figure class="course-figure">
  <img src="../../assets/course-figures/model-responsibility.svg" alt="Input features passing through a learned model transformation to produce a prediction">
  <figcaption>Different architectures learn different transformations, but every predictive model maps an agreed input contract to an output.</figcaption>
</figure>

Their internal structures differ because they solve different kinds of prediction problems.

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

<figure class="course-figure">
  <img src="../../assets/course-figures/neuron-computation.svg" alt="Neuron inputs entering a weighted sum with bias, followed by an activation function and output">
  <figcaption>A neuron first combines its inputs with learned weights and a bias, then applies an activation function to the result.</figcaption>
</figure>

Common activation functions have different responsibilities:

| Activation | Typical role |
|---|---|
| Linear | Predicting an unrestricted numerical value |
| ReLU | Learning non-linear patterns in hidden layers |
| Sigmoid | Producing a value between `0` and `1` |

<figure class="course-figure">
  <img src="../../assets/course-figures/activation-functions.svg" alt="Plots comparing Linear, ReLU, and Sigmoid activation functions">
  <figcaption>Linear preserves the full numerical range, ReLU introduces a simple non-linearity, and Sigmoid compresses its output into a probability-like value between 0 and 1.</figcaption>
</figure>

The spam network uses ReLU in its hidden layers and Sigmoid in its output layer. The regression network uses a Linear output.

Without non-linear activation functions in hidden layers, stacking several layers would still behave like a single linear transformation. Non-linearity allows hidden layers to represent more complex relationships.

## How training works

Defining the architecture creates an untrained network. Its initial weights and biases do not yet represent useful patterns in the dataset.

Training repeatedly performs this high-level loop:

<figure class="course-figure">
  <img src="../../assets/course-figures/neural-network-training-cycle.svg" alt="Training cycle from input samples and forward prediction to loss measurement and parameter adjustment">
  <figcaption>Each cycle uses the current parameters to make predictions, measures their error, and produces updated weights and biases for the next pass.</figcaption>
</figure>

In more specific terms, training:

1. sends samples forward through the complete network,
2. compares predictions with known targets,
3. measures the error using a loss function,
4. uses backpropagation and an optimizer to adjust parameters.

The network architecture remains the same during this process. What changes are the learned weights and biases inside its neurons.

### From loss to a parameter update

One training update connects four operations:

<figure class="course-figure">
  <img src="../../assets/course-figures/neural-network-parameter-update.svg" alt="Forward pass, prediction and loss, backpropagation gradients, and optimizer parameter update">
  <figcaption>Backpropagation calculates gradients with the chain rule; the optimizer combines those gradients with the learning rate to update the parameters.</figcaption>
</figure>

A **gradient** describes how the loss would change if one parameter changed slightly. Backpropagation moves from the output toward earlier layers and applies the chain rule to calculate a gradient for every trainable weight and bias.

The optimizer then uses those gradients. The simplest update is gradient descent:

```text
new weight = old weight - learning rate * gradient
```

The learning rate controls the size of each step. If it is too large, loss may oscillate or diverge. If it is too small, training may improve so slowly that it does not converge within the chosen epoch limit.

### Epochs, batches, and updates

An **epoch** is one complete pass through the training set. A **batch** is the group of samples used to calculate one parameter update.

For `1,000` samples and a batch size of `100`:

```text
1 epoch = 10 batches = 10 parameter updates
```

Smaller batches update the model more frequently and introduce useful variation, while larger batches produce smoother estimates but require more memory. Epoch count and batch size are hyperparameters: neither is learned by the network.

### Why ReLU helps deeper networks

Backpropagation multiplies derivatives while moving through layers. With many Sigmoid or Tanh layers, these values can repeatedly shrink until early layers receive an almost-zero gradient. This is the **vanishing gradient** problem.

ReLU is commonly used in hidden layers because its positive-side derivative does not shrink the gradient in the same way. It does not eliminate every training difficulty, but it is one reason ReLU is a practical default for deeper feed-forward and convolutional networks.

### Count model parameters

For two consecutive fully connected layers, the parameter count is:

```text
parameters = inputs * outputs + output biases
```

For the Iris architecture `4 -> 16 -> 3`:

```text
input to hidden: 4 * 16 + 16 = 80
hidden to output: 16 * 3 + 3 = 51
total: 131 trainable parameters
```

More parameters increase model capacity, but they also increase memory use and the risk of overfitting. Parameter count therefore helps compare architectures more meaningfully than layer count alone.

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

Continue with [Backpropagation](05-backpropagation.md) to see how loss gradients flow backward through these layers and update every trainable parameter.
