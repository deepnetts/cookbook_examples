# Machine Learning Basics

Machine Learning is a way of building software that learns patterns from examples instead of relying only on rules written by a developer.

In traditional programming, you provide data and explicit rules. In supervised Machine Learning, you provide data together with known results, and a training algorithm uses those examples to create a model. The trained model can then make predictions for new data:

<figure class="course-figure">
  <img src="../../assets/course-figures/ml-learning-workflow.svg" alt="Comparison of traditional programming and supervised Machine Learning workflows">
  <figcaption>Traditional software executes rules written by a developer; supervised learning derives a reusable model from examples with known targets.</figcaption>
</figure>

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

The number of input features determines whether a problem uses simple or multiple linear regression. Compare both examples below.

<div class="ml-concept-cards">
  <a class="ml-concept-card" href="../../examples/regression/sorting-execution-time-prediction/">
    <span>Simple linear regression</span>
    <h3>Sorting Execution Time</h3>
    <p>One numerical feature - the comparison count - is used to predict one continuous execution-time value.</p>
    <pre><code>comparison count → model → execution time</code></pre>
    <span class="ml-concept-card-action">Explore Sorting Time Prediction →</span>
  </a>
  <a class="ml-concept-card" href="../../examples/regression/computer-hardware-performance-prediction/">
    <span>Multiple linear regression</span>
    <h3>Computer Hardware Performance</h3>
    <p>Six hardware characteristics contribute to the predicted published relative performance (<code>PRP</code>).</p>
    <pre><code>hardware features → model → PRP: 347.25</code></pre>
    <span class="ml-concept-card-action">Explore Hardware Performance →</span>
  </a>
  <a class="ml-concept-card" href="../../examples/regression/insurance-payment-prediction/">
    <span>Simple linear regression</span>
    <h3>Insurance Payment Prediction</h3>
    <p>One normalized claim-count feature is used to estimate the normalized total insurance payment.</p>
    <pre><code>claim count → model → total payment</code></pre>
    <span class="ml-concept-card-action">Explore Insurance Prediction →</span>
  </a>
  <a class="ml-concept-card" href="../../examples/regression/house-price-prediction/">
    <span>Nonlinear regression</span>
    <h3>House Price Prediction</h3>
    <p>Hidden layers learn a nonlinear relationship between prepared <code>LSTAT</code> data and median house value.</p>
    <pre><code>LSTAT → neural network → MEDV</code></pre>
    <span class="ml-concept-card-action">Explore House Price Prediction →</span>
  </a>
</div>

## Classification

Classification predicts which category a sample belongs to.

The target may contain two classes, several classes, or categories inferred from image pixels. Compare the four common patterns below.

<div class="ml-concept-cards">
  <a class="ml-concept-card" href="../../examples/classification/email-spam-detection/">
    <span>Binary classification</span>
    <h3>Email Spam Detection</h3>
    <p>The model produces a probability, then a threshold converts it into <code>SPAM</code> or <code>NOT SPAM</code>.</p>
    <pre><code>email features → model → spam probability
&lt; 0.5  → NOT SPAM
≥ 0.5  → SPAM</code></pre>
    <span class="ml-concept-card-action">Explore Email Spam Detection →</span>
  </a>
  <a class="ml-concept-card" href="../../examples/classification/sonar-rock-mine-classification/">
    <span>Logistic regression</span>
    <h3>Sonar Rock or Mine</h3>
    <p>A compact model connects 60 signal features directly to one Sigmoid output and applies the same binary threshold.</p>
    <pre><code>sonar signals → model → ROCK or MINE</code></pre>
    <span class="ml-concept-card-action">Explore Sonar Classification →</span>
  </a>
  <a class="ml-concept-card" href="../../examples/classification/iris-flower-classification/">
    <span>Multiclass classification</span>
    <h3>Iris Flower Classification</h3>
    <p>Three one-hot targets represent the known species. The model produces one probability per class and selects the largest.</p>
    <pre><code>flower measurements → SETOSA
                    → VERSICOLOR
                    → VIRGINICA</code></pre>
    <span class="ml-concept-card-action">Explore Iris Classification →</span>
  </a>
  <a class="ml-concept-card" href="../../examples/classification/credit-card-fraud-detection/">
    <span>Binary classification</span>
    <h3>Credit Card Fraud Detection</h3>
    <p>A balanced transaction dataset trains a model to estimate fraud probability from 29 numerical features.</p>
    <pre><code>transaction features → FRAUD or LEGITIMATE</code></pre>
    <span class="ml-concept-card-action">Explore Fraud Detection →</span>
  </a>
  <a class="ml-concept-card" href="../../examples/image-classification/">
    <span>Convolutional networks</span>
    <h3>Image Classification</h3>
    <p>Hot Dog, Duke, and Parking models learn local visual patterns from RGB pixels arranged by width, height, and color channel.</p>
    <pre><code>image pixels → CNN → predicted class</code></pre>
    <span class="ml-concept-card-action">Explore Image Classification →</span>
  </a>
</div>

## Regression or classification?

The target determines the type of supervised learning problem:

| Target | Problem type | Example prediction |
|---|---|---|
| Continuous numerical value | Regression | `347.25` |
| One of a fixed set of classes | Classification | `SPAM` |
| One of three or more classes | Multiclass classification | `SETOSA` |

A useful first question for any Machine Learning project is therefore:

> What exactly should the model predict?

If the answer is a quantity, the problem is usually regression. If the answer is a category, the problem is classification.

## Training, testing, and generalization

A model must learn from one group of samples and be evaluated on different samples. This separation checks whether it learned a reusable pattern instead of memorizing the examples it already saw.

```text
complete dataset
      |
      +---- training set -> learn weights and biases
      |
      +---- test set -----> measure behavior on unseen samples
```

An `80/20` train/test split is a common starting point, although the right proportion depends on dataset size. The important rule is that the test set must not participate in training or in fitting preprocessing values.

When a model performs very well on training data but poorly on unseen data, it is **overfitting**. When it performs poorly even on training data, it is usually **underfitting** and may need better features, more training, or a more suitable architecture.

## Reading evaluation metrics

Evaluation translates model behavior into measurements. A single metric rarely tells the complete story, so choose metrics that match the task and the cost of different mistakes.

### Regression metrics

| Metric | What it measures | Better result |
|---|---|---|
| Mean Absolute Error (MAE) | Average absolute prediction error | Lower |
| Mean Squared Error (MSE) | Average squared error, with more emphasis on large misses | Lower |
| Root Mean Squared Error (RMSE) | Square root of MSE, on the target's general scale | Lower |
| R-squared (R²) | Improvement over always predicting the target mean | Usually closer to `1` |

MSE can be written as:

```text
MSE = sum((actual - predicted)^2) / number of samples
```

Because the errors are squared, one large error influences MSE more strongly than several small errors.

### Classification metrics

A binary classifier produces four possible outcomes:

| | Predicted positive | Predicted negative |
|---|---|---|
| **Actually positive** | True positive (TP) | False negative (FN) |
| **Actually negative** | False positive (FP) | True negative (TN) |

These counts form a **confusion matrix** and support several metrics:

```text
accuracy  = (TP + TN) / all predictions
precision = TP / (TP + FP)
recall    = TP / (TP + FN)
F1        = 2 * precision * recall / (precision + recall)
```

- Accuracy describes overall correctness, but can hide poor behavior when classes are imbalanced.
- Precision matters when a false alarm is expensive. In spam detection, it asks how many emails marked as spam really were spam.
- Recall matters when missing a positive case is expensive. In fraud detection, it asks how much real fraud the model found.
- F1 summarizes the balance between precision and recall.

Always interpret these values in the context of the application rather than choosing a model only because one number is largest.

## Key terms

| Term | Meaning |
|---|---|
| Sample | One observation or dataset row |
| Feature | An input value describing a sample |
| Target | The value or class the model learns to predict |
| Model | A learned mapping from features to a prediction |
| Training | The process of learning the model from known examples |
| Prediction | The model output for new input data |
| Generalization | Useful performance on samples not seen during training |
| Overfitting | Strong training performance but weak unseen-data performance |

## Continue learning

Next, look inside a neural network and see how it transforms features into predictions.
