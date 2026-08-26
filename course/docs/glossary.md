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

## Epoch

One complete pass through the training dataset.

## Evaluation

The process of measuring a trained model using suitable metrics, preferably on data that was not used for training.

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

## Learning rate

A training hyperparameter that controls the size of each parameter update. A value that is too large can make training unstable, while a value that is too small can make learning slow.

## Linear activation

An activation that returns its input without restricting its range. It is commonly used in an output layer for regression.

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

## Regression

A supervised learning task in which the target is a continuous numerical value, such as computer performance or house price.

## Root Mean Squared Error (RMSE)

The square root of Mean Squared Error. It expresses prediction error on the same general scale as the target. Lower values are better.

## Sample

One observation in a dataset. In tabular data, one row usually represents one sample.

## Sigmoid

An activation function that produces a value between `0` and `1`. It is commonly used for the output of a binary classifier.

## Softmax

An output activation that converts multiple scores into class probabilities that sum to approximately `1`. The class with the largest probability becomes the prediction.

## Standardization

A preprocessing transformation that centers and scales numerical features so their values are comparable. Its parameters should be learned from training data only.

## Supervised learning

A type of Machine Learning in which the training data contains both input features and known targets.

## Target

The value or class that a supervised model learns to predict. `PRP` and `is_spam` are targets in the course examples.

## Test set

The subset of data reserved for evaluating a trained model on unseen samples. It must not influence model training or fitted preprocessing parameters.

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

## Underfitting

A condition in which a model has not learned the relevant pattern well enough and performs poorly even on its training data.

## Vanishing gradient

A training problem in which gradients become extremely small as they are propagated through many layers, causing early layers to learn very slowly or stop learning.

## Weight

A trainable parameter that controls how strongly an input or neuron output influences another neuron.
