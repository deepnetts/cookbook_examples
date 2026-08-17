# Classification Examples

Classification models predict categories. Use binary classification when there are two possible classes and multiclass classification when the model must choose from three or more classes.

## Choose a project

| Example | Inputs | Classes | Best first use |
|---|---:|---:|---|
| [Spam Classification](spam-classification.md) | 5 | 2 | Learn probabilities, thresholds, and binary decisions |
| [Multiclass Classification](multiclass-classification.md) | 4 | 3 | Learn one-hot targets, Softmax, and class selection |

## Recommended order

Start with Spam Classification to see how one Sigmoid output represents the probability of a positive class. Continue with Multiclass Classification to produce one probability per class and select the largest.

Both projects demonstrate:

- categorical targets;
- Min-Max feature scaling;
- feed-forward neural networks with hidden layers;
- Cross-Entropy loss;
- classification metrics on unseen samples;
- converting model outputs into class labels.

[Back to all examples](../index.md) · [How to run the projects](../running-examples.md)
