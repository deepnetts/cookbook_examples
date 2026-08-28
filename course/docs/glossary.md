# Machine Learning Glossary

This glossary defines the main terms used throughout the Deep Netts course.

## Quick navigation

[A](#activation-function) ·
[B](#backpropagation) ·
[C](#classification) ·
[D](#data-leakage) ·
[E](#epoch) ·
[F](#f1-score) ·
[G](#generalization) ·
[H](#hidden-layer) ·
[I](#input-layer) ·
[L](#learning-rate) ·
[M](#mean-absolute-error-mae) ·
[N](#neural-network) ·
[O](#one-hot-encoding) ·
[P](#parameter) ·
[R](#r-squared-r2) ·
[S](#sample) ·
[T](#target) ·
[U](#underfitting) ·
[V](#vanishing-gradient) ·
[W](#weight)

## Activation function

A function applied to a neuron's weighted sum. It determines how that value is transformed before being passed to the next layer or returned as an output. Examples include Linear, ReLU, and Sigmoid.

## Attention

A mechanism that lets a model assign different importance to parts of its input when creating a representation. In text models, attention helps one token use relevant information from other token positions.

## Accuracy

The proportion of classification predictions that are correct. Accuracy can be misleading when one class is much more common than another.

## Backpropagation

The process used to calculate how much each network parameter contributed to the loss. These calculations allow the optimizer to update weights and biases during training.

## Batch

A group of training samples processed before the model parameters are updated. A batch size of `64` means that 64 samples contribute to one update.

## Bias

A trainable value added to a neuron's weighted inputs. It allows the neuron to shift its output independently of the input values.

## Binary classification

A classification problem with two possible classes, such as `SPAM` and `NOT SPAM`.

## Classification

A supervised learning task in which the target is one of a fixed set of categories.

## Chain rule

A calculus rule for differentiating nested functions. Backpropagation applies the chain rule from the loss toward earlier layers to calculate a gradient for every trainable parameter.

## Multiclass classification

A classification problem with three or more possible classes. The Iris example predicts `SETOSA`, `VERSICOLOR`, or `VIRGINICA`.

## One-hot encoding

A class representation with one target column per class. The correct class contains `1` and all other class columns contain `0`.

## Confusion matrix

A table that counts correct and incorrect classification results for each class. It shows which types of mistakes the model makes.

## Cross-Entropy

A loss function commonly used for classification. It penalizes predicted probabilities that disagree with the known target class.

## Convergence

The state in which training updates have reached a stable region and the loss no longer improves substantially. Slow or unstable convergence can indicate an unsuitable learning rate, preprocessing, or architecture.

## Data leakage

The accidental use of information during training that would not be available when predicting genuinely unseen data. Fitting preprocessing on the complete dataset before a train/test split is one example.

## Dataset

A collection of samples used for training, evaluation, or prediction. In the course examples, datasets are stored as CSV files.

## Decision boundary

The boundary that separates regions assigned to different classes. Logistic regression learns a linear decision boundary, while hidden layers can represent nonlinear boundaries.

## Diffusion model

A generative-model family that learns to create data by reversing a gradual noising process. Diffusion models are commonly used for image, audio, and video generation.

## Epoch

One complete pass through the training dataset.

## Evaluation

The process of measuring a trained model using suitable metrics, preferably on data that was not used for training.

## Fine-tuning

Additional training that adapts a pretrained model to a narrower task, domain, or behavior using a more focused dataset.

## F1 score

A classification metric that combines precision and recall into one value. It is useful when both false positives and false negatives matter.

## Feature

An input value that describes a sample. For example, `num_links` is one feature in the email-spam-detection dataset.

## False negative

A positive sample incorrectly predicted as negative. For fraud detection, this is a fraudulent transaction predicted as legitimate.

## False positive

A negative sample incorrectly predicted as positive. For spam detection, this is a legitimate email incorrectly marked as spam.

## Feed-forward network

A neural network in which information flows from the input layer through any hidden layers to the output layer.

## Forward propagation

The process of sending input values through the network to calculate a prediction.

## Generative AI

Machine Learning systems designed to produce new content such as text, images, audio, or code. Generative systems still rely on model parameters, loss functions, backpropagation, and optimization, but use objectives and architectures suited to generation.

## Generative Adversarial Network (GAN)

A generative architecture in which a generator creates samples and a discriminator learns to distinguish generated samples from real ones. The two models improve through competing objectives.

## Generalization

A model's ability to make useful predictions for samples that were not part of its training data.

## Gradient

A value describing how the loss changes with respect to a model parameter. Backpropagation calculates gradients so the optimizer knows how to adjust weights and biases.

## Gradient descent

An optimization method that updates parameters in the direction that reduces loss. The learning rate controls the size of each update.

## Hidden layer

A neural-network layer between the input and output layers. Hidden layers can learn intermediate and non-linear representations of input features.

## Hyperparameter

A configuration value chosen by the developer rather than learned as a model weight. Examples include learning rate, number of epochs, batch size, and layer size.

## Input layer

The first neural-network layer. It receives the feature values and defines the expected number of model inputs.

## Inference

Using a trained model to produce a prediction for new input data. Inference must apply the same feature order and fitted preprocessing used during training.

## Large Language Model (LLM)

A language model trained at large scale to predict and generate token sequences. An external LLM service is not an integrated Deep Netts feature unless an application connects to it explicitly.

## Learning rate

A training hyperparameter that controls the size of each parameter update. A value that is too large can make training unstable, while a value that is too small can make learning slow.

## Linear activation

An activation that returns its input without restricting its range. It is commonly used in an output layer for regression.

## Logistic regression

A binary classification model that applies Sigmoid to a weighted linear score. It returns a positive-class probability and learns a linear decision boundary.

## Logit

A model's raw score before a probability-producing function such as Sigmoid or Softmax is applied. Temperature changes the scale of logits before sampling in a generative model.

## Loss function

A function that measures the difference between a model prediction and the known target. Training adjusts model parameters to reduce this value.

## Mean Absolute Error (MAE)

A regression metric that calculates the average absolute difference between predicted and actual values. Lower values are better.

## Mean Squared Error (MSE)

A regression loss or metric that calculates the average squared difference between predicted and actual values. Squaring gives larger errors more influence.

## Min-Max scaling

A preprocessing transformation that maps numerical features to a defined range, commonly from `0` to `1`.

## Mini-batch

A subset of training samples used to calculate one parameter update. Mini-batch training balances the noisy updates of one-sample training with the memory cost of processing the complete dataset at once.

## Model

A learned mapping from input features to a prediction. In a neural network, the learned information is represented primarily by weights and biases.

## Multi-head attention

Several attention operations performed in parallel with different learned projections. Their results are combined so the model can represent multiple kinds of relationships between token positions.

## Multiple linear regression

Linear regression with two or more input features. It learns one weight per feature and a shared bias to predict a continuous target.

## Neural network

A model composed of connected layers of neurons that transform input features into predictions.

## Neuron

A computational unit that combines weighted inputs and a bias, then usually applies an activation function.

## Optimizer

The algorithm that updates weights and biases during training. Stochastic Gradient Descent (`SGD`) is used in the introductory examples.

## Overfitting

A condition in which a model learns its training data too specifically and performs substantially worse on unseen samples.

## Output layer

The final neural-network layer. Its size and activation function are selected to match the prediction task.

## Parameter

A value learned during training, such as a weight or bias.

## Precision

Of all samples predicted as belonging to a class, the proportion that actually belongs to that class. For spam detection, it answers: of all emails marked as spam, how many were really spam?

## Pre-training

The initial training phase in which a model learns broad patterns from a large dataset before any task- or domain-specific fine-tuning.

## Prediction

The output produced by a trained model for new input features.

## Preprocessing

Transformations or preparation applied to data before model training or prediction. Examples include standardization and Min-Max scaling.

## R-squared (R²)

A regression metric describing how much of the target variation is explained by the model. Values closer to `1` generally indicate a stronger fit, although the metric must be interpreted in context.

## Recall

Of all samples that actually belong to a class, the proportion correctly identified. For spam detection, it answers: of all real spam emails, how many did the model detect?

## Rectified Linear Unit (ReLU)

A commonly used hidden-layer activation function. It returns zero for negative inputs and returns positive inputs unchanged.

## Residual connection

A shortcut that adds a block's original input to its transformed output. Residual connections help information and gradients travel through deep architectures such as Transformers.

## Regression

A supervised learning task in which the target is a continuous numerical value, such as computer performance or house price.

## Root Mean Squared Error (RMSE)

The square root of Mean Squared Error. It expresses prediction error on the same general scale as the target. Lower values are better.

## Sample

One observation in a dataset. In tabular data, one row usually represents one sample.

## Sampling

Selecting an output from a model's probability distribution instead of always choosing the highest-probability option. Generative systems use sampling controls such as temperature to vary output diversity.

## Self-attention

Attention in which queries, keys, and values are derived from the same input sequence. It creates context-aware token representations by comparing positions within that sequence.

## Sigmoid

An activation function that produces a value between `0` and `1`. It is commonly used for the output of a binary classifier.

## Simple linear regression

Linear regression with one input feature and one continuous target. It learns the slope and intercept of a fitted line, represented by $\hat{y}=wx+b$.

## Softmax

An output activation that converts multiple scores into class probabilities that sum to approximately `1`. The class with the largest probability becomes the prediction.

## Standardization

A preprocessing transformation that centers and scales numerical features so their values are comparable. Its parameters should be learned from training data only.

## Supervised learning

A type of Machine Learning in which the training data contains both input features and known targets.

## Target

The value or class that a supervised model learns to predict. `PRP` and `is_spam` are targets in the course examples.

## Tanh

An activation function that smoothly maps values into the range from `-1` to `1`. Its zero-centered output can be useful in hidden layers.

## Temperature

A sampling control that rescales logits before Softmax. Lower values concentrate probability on likely outputs, while higher values produce a flatter distribution and more varied choices.

## Test set

The subset of data reserved for evaluating a trained model on unseen samples. It must not influence model training or fitted preprocessing parameters.

## Token

A unit processed by a language model, such as a word, part of a word, punctuation mark, or other encoded text fragment. Next-token prediction estimates a probability distribution for the token that follows the current context.

## Training

The process of learning model parameters from examples by repeatedly calculating predictions, measuring loss, and updating weights and biases.

## Training set

The subset of data used to fit preprocessing and learn model parameters.

## True negative

A negative sample correctly predicted as negative. For spam detection, this is a legitimate email correctly left outside the spam class.

## True positive

A positive sample correctly predicted as positive. For fraud detection, this is a fraudulent transaction correctly detected as fraud.

## Train/test split

The division of a dataset into separate training and evaluation subsets.

## Transformer

A sequence-model architecture built from attention, learned projections, feed-forward networks, residual connections, normalization, and positional information. The current cookbook explains the concept but does not include a runnable Deep Netts Transformer project.

## Underfitting

A condition in which a model has not learned the relevant pattern well enough and performs poorly even on its training data.

## Vanishing gradient

A training problem in which gradients become extremely small as they are propagated through many layers, causing early layers to learn very slowly or stop learning.

## Variational Autoencoder (VAE)

A generative model that learns a structured probability distribution in a latent space and decodes sampled latent values into new data.

## Weight

A trainable parameter that controls how strongly an input or neuron output influences another neuron.
