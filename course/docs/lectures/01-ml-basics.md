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

The number of input features determines whether a problem uses simple or multiple linear regression. Compare both examples below.

<div class="ml-concept-cards">
  <article>
    <span>Simple linear regression</span>
    <h3>Sorting Execution Time</h3>
    <p>One numerical feature—the comparison count—is used to predict one continuous execution-time value.</p>
    <pre><code>comparison count → model → execution time</code></pre>
    <a href="../../examples/regression/sorting-execution-time-prediction/">Explore Sorting Time Prediction →</a>
  </article>
  <article>
    <span>Multiple linear regression</span>
    <h3>Computer Hardware Performance</h3>
    <p>Six hardware characteristics contribute to the predicted published relative performance (<code>PRP</code>).</p>
    <pre><code>hardware features → model → PRP: 347.25</code></pre>
    <a href="../../examples/regression/computer-hardware-performance-prediction/">Explore Hardware Performance →</a>
  </article>
  <article>
    <span>Simple linear regression</span>
    <h3>Insurance Payment Prediction</h3>
    <p>One normalized claim-count feature is used to estimate the normalized total insurance payment.</p>
    <pre><code>claim count → model → total payment</code></pre>
    <a href="../../examples/regression/insurance-payment-prediction/">Explore Insurance Prediction →</a>
  </article>
  <article>
    <span>Nonlinear regression</span>
    <h3>House Price Prediction</h3>
    <p>Hidden layers learn a nonlinear relationship between prepared <code>LSTAT</code> data and median house value.</p>
    <pre><code>LSTAT → neural network → MEDV</code></pre>
    <a href="../../examples/regression/house-price-prediction/">Explore House Price Prediction →</a>
  </article>
</div>

## Classification

Classification predicts which category a sample belongs to.

The target may contain two classes, several classes, or categories inferred from image pixels. Compare the four common patterns below.

<div class="ml-concept-cards">
  <article>
    <span>Binary classification</span>
    <h3>Email Spam Detection</h3>
    <p>The model produces a probability, then a threshold converts it into <code>SPAM</code> or <code>NOT SPAM</code>.</p>
    <pre><code>email features → model → spam probability
&lt; 0.5  → NOT SPAM
≥ 0.5  → SPAM</code></pre>
    <a href="../../examples/classification/email-spam-detection/">Explore Email Spam Detection →</a>
  </article>
  <article>
    <span>Logistic regression</span>
    <h3>Sonar Rock or Mine</h3>
    <p>A compact model connects 60 signal features directly to one Sigmoid output and applies the same binary threshold.</p>
    <pre><code>sonar signals → model → ROCK or MINE</code></pre>
    <a href="../../examples/classification/sonar-rock-mine-classification/">Explore Sonar Classification →</a>
  </article>
  <article>
    <span>Multiclass classification</span>
    <h3>Iris Flower Classification</h3>
    <p>Three one-hot targets represent the known species. The model produces one probability per class and selects the largest.</p>
    <pre><code>flower measurements → SETOSA
                    → VERSICOLOR
                    → VIRGINICA</code></pre>
    <a href="../../examples/classification/iris-flower-classification/">Explore Iris Classification →</a>
  </article>
  <article>
    <span>Binary classification</span>
    <h3>Credit Card Fraud Detection</h3>
    <p>A balanced transaction dataset trains a model to estimate fraud probability from 29 numerical features.</p>
    <pre><code>transaction features → FRAUD or LEGITIMATE</code></pre>
    <a href="../../examples/classification/credit-card-fraud-detection/">Explore Fraud Detection →</a>
  </article>
  <article>
    <span>Convolutional networks</span>
    <h3>Image Classification</h3>
    <p>Hot Dog, Duke, and Parking models learn local visual patterns from RGB pixels arranged by width, height, and color channel.</p>
    <pre><code>image pixels → CNN → predicted class</code></pre>
    <a href="../../examples/image-classification/">Explore Image Classification →</a>
  </article>
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
