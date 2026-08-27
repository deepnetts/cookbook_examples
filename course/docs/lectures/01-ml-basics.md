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

The number of input features and the relationship in the data determine which regression model fits the problem. Compare the examples below.

<div class="classification-comparison regression-comparison" role="region" aria-label="Regression approaches comparison" tabindex="0">
  <table>
    <thead>
      <tr>
        <th scope="col">Approach</th>
        <th scope="col">Example</th>
        <th scope="col">Features</th>
        <th scope="col">Target</th>
        <th scope="col">Walkthrough</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Simple linear regression</strong></td>
        <td>Sorting Execution Time</td>
        <td>Comparison count</td>
        <td><span class="classification-outcomes"><code>execution_time_ms</code></span></td>
        <td><a href="../../examples/regression/sorting-execution-time-prediction/" target="_blank" rel="noopener">View example →</a></td>
      </tr>
      <tr>
        <td><strong>Multiple linear regression</strong></td>
        <td>Computer Hardware Performance</td>
        <td>Six hardware characteristics</td>
        <td><span class="classification-outcomes"><code>PRP</code></span></td>
        <td><a href="../../examples/regression/computer-hardware-performance-prediction/" target="_blank" rel="noopener">View example →</a></td>
      </tr>
      <tr>
        <td><strong>Simple linear regression</strong></td>
        <td>Insurance Payment Prediction</td>
        <td>Normalized claim count</td>
        <td><span class="classification-outcomes"><code>total payment</code></span></td>
        <td><a href="../../examples/regression/insurance-payment-prediction/" target="_blank" rel="noopener">View example →</a></td>
      </tr>
      <tr>
        <td><strong>Nonlinear regression</strong></td>
        <td>House Price Prediction</td>
        <td>Prepared LSTAT data</td>
        <td><span class="classification-outcomes"><code>MEDV</code></span></td>
        <td><a href="../../examples/regression/house-price-prediction/" target="_blank" rel="noopener">View example →</a></td>
      </tr>
    </tbody>
  </table>
</div>

## Classification

Classification predicts which category a sample belongs to.

The target may contain two classes, several classes, or categories inferred from image pixels. Compare the common patterns below.

<div class="classification-comparison" role="region" aria-label="Classification approaches comparison" tabindex="0">
  <table>
    <thead>
      <tr>
        <th scope="col">Approach</th>
        <th scope="col">Example</th>
        <th scope="col">Features</th>
        <th scope="col">Target</th>
        <th scope="col">Classes</th>
        <th scope="col">Walkthrough</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Binary classification</strong></td>
        <td>Email Spam Detection</td>
        <td>Email and sender characteristics</td>
        <td><span class="target-name">is_spam</span></td>
        <td><span class="classification-outcomes"><code>NOT SPAM</code><code>SPAM</code></span></td>
        <td><a href="../../examples/classification/email-spam-detection/" target="_blank" rel="noopener">View example →</a></td>
      </tr>
      <tr>
        <td><strong>Logistic regression</strong></td>
        <td>Sonar Rock or Mine</td>
        <td>60 numerical sonar-signal values</td>
        <td>Binary label</td>
        <td><span class="classification-outcomes"><code>ROCK</code><code>MINE</code></span></td>
        <td><a href="../../examples/classification/sonar-rock-mine-classification/" target="_blank" rel="noopener">View example →</a></td>
      </tr>
      <tr>
        <td><strong>Multiclass classification</strong></td>
        <td>Iris Flower Classification</td>
        <td>Four flower measurements</td>
        <td>Species (one-hot)</td>
        <td><span class="classification-outcomes"><code>SETOSA</code><code>VERSICOLOR</code><code>VIRGINICA</code></span></td>
        <td><a href="../../examples/classification/iris-flower-classification/" target="_blank" rel="noopener">View example →</a></td>
      </tr>
      <tr>
        <td><strong>Binary classification</strong></td>
        <td>Credit Card Fraud Detection</td>
        <td>29 numerical transaction features</td>
        <td><span class="target-name">Class</span></td>
        <td><span class="classification-outcomes"><code>LEGITIMATE</code><code>FRAUD</code></span></td>
        <td><a href="../../examples/classification/credit-card-fraud-detection/" target="_blank" rel="noopener">View example →</a></td>
      </tr>
      <tr>
        <td><strong>Convolutional network</strong></td>
        <td>Hot Dog Detection</td>
        <td>RGB image pixels</td>
        <td>Image label</td>
        <td><span class="classification-outcomes"><code>HOT DOG</code><code>NOT HOT DOG</code></span></td>
        <td><a href="../../examples/image-classification/hotdog-nothotdog/" target="_blank" rel="noopener">View example →</a></td>
      </tr>
      <tr>
        <td><strong>Convolutional network</strong></td>
        <td>Duke Logo Recognition</td>
        <td>RGB image pixels</td>
        <td>Image label</td>
        <td><span class="classification-outcomes"><code>DUKE</code><code>NEGATIVE</code></span></td>
        <td><a href="../../examples/image-classification/duke-logo-recognition/" target="_blank" rel="noopener">View example →</a></td>
      </tr>
      <tr>
        <td><strong>Convolutional network</strong></td>
        <td>Parking Lot Occupancy</td>
        <td>RGB image pixels</td>
        <td>Image label</td>
        <td><span class="classification-outcomes"><code>BUSY</code><code>NEGATIVE</code></span></td>
        <td><a href="../../examples/image-classification/parking-lot-occupancy/" target="_blank" rel="noopener">View example →</a></td>
      </tr>
    </tbody>
  </table>
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

<figure class="course-figure">
  <img src="../../assets/course-figures/train-test-split.svg" alt="A complete dataset split into a training set for learning weights and biases and a test set for evaluation on unseen samples">
  <figcaption>The training set teaches the model; the separate test set checks whether what it learned generalizes to unseen samples.</figcaption>
</figure>

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

<figure class="course-figure">
  <img src="../../assets/course-figures/confusion-matrix.svg" alt="Confusion matrix with actual labels in rows and predicted labels in columns, showing true positive, false negative, false positive, and true negative outcomes">
  <figcaption>Rows show the actual label and columns show the predicted label. Green cells are correct predictions; amber cells are classification errors.</figcaption>
</figure>

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
