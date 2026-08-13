# Machine Learning Basics

Machine Learning is a way of building software that learns patterns from examples instead of relying only on rules written by a developer.

In traditional programming, you provide data and explicit rules:

```text
data + rules -> result
```

In supervised Machine Learning, you provide data together with known results. A training algorithm uses those examples to create a model:

```text
training data + known results -> trained model
```

The trained model can then make predictions for new data:

```text
new data + trained model -> prediction
```

## Samples, features, and targets

A dataset contains **samples**. Each sample represents one observation, such as one computer or one email.

The input values that describe a sample are called **features**. The value that the model should learn to predict is called the **target**.

For example, a computer-performance dataset may contain:

```text
Features: MYCT, MMIN, MMAX, CACH, CHMIN, CHMAX
Target:   PRP
```

One row is one computer. Its hardware properties are the features, while its published relative performance (`PRP`) is the target.

An email dataset may contain:

```text
Features: num_links, num_words, has_offer, sender_score, all_caps
Target:   is_spam
```

Here, one row represents one email. The model uses the five features to predict whether that email is spam.

## Regression

Regression predicts a numerical value. The result can take many possible values rather than belonging to a fixed category.

Examples include predicting:

- computer performance,
- house price,
- energy consumption,
- response time.

The computer hardware example in this project is a regression problem because `PRP` is a number:

```text
hardware features -> model -> predicted PRP: 347.25
```

[Full Multiple Linear Regression on GitHub](https://github.com/deepnetts/cookbook-examples/tree/main/examples/multiple-linear-regression)

## Classification

Classification predicts which category a sample belongs to.

Examples include:

- spam or not spam,
- fraudulent or legitimate,
- customer stays or leaves,
- one product category among several categories.

The spam example is a binary classification problem because it has two possible classes:

```text
email features -> model -> SPAM or NOT SPAM
```

The model first produces a probability. A threshold can then convert that probability into a class. With a threshold of `0.5`:

```text
probability < 0.5  -> NOT SPAM
probability >= 0.5 -> SPAM
```

[Full Spam Classification on GitHub](https://github.com/deepnetts/cookbook-examples/tree/main/examples/spam-classification)

## Regression or classification?

The target determines the type of supervised learning problem:

| Target | Problem type | Example prediction |
|---|---|---|
| Continuous numerical value | Regression | `347.25` |
| One of a fixed set of classes | Classification | `SPAM` |

A useful first question for any Machine Learning project is therefore:

> What exactly should the model predict?

If the answer is a quantity, the problem is usually regression. If the answer is a category, the problem is classification.

## Key terms

| Term | Meaning |
|---|---|
| Sample | One observation or dataset row |
| Feature | An input value describing a sample |
| Target | The value or class the model learns to predict |
| Model | A learned mapping from features to a prediction |
| Training | The process of learning the model from known examples |
| Prediction | The model output for new input data |

## Continue learning

Next, look inside a neural network and see how it transforms features into predictions.
