# Making Predictions

Pass raw feature values to a trained network in exactly the same order used by the training dataset. When the fitted normalizer was attached before saving, the model keeps preprocessing with the prediction pipeline.

## Regression

Regression returns a continuous value:

```java
float[] hardware = {
    125,  // MYCT
    256,  // MMIN
    6000, // MMAX
    256,  // CACH
    16,   // CHMIN
    128   // CHMAX
};

float predictedPerformance = neuralNet.predict(hardware)[0];
```

## Binary classification

A single Sigmoid output can be converted into a class using a threshold:

```java
float[] email = {4, 55, 1, 0.35f, 1};

float spamProbability = neuralNet.predict(email)[0];
String predictedClass =
        spamProbability >= 0.5f ? "SPAM" : "NOT SPAM";
```

Choose the threshold based on the application's false-positive and false-negative costs rather than assuming `0.5` is always optimal.

## Multiclass classification

Softmax returns one probability per class. Select the index with the largest value:

```java
float[] flower = {5.1f, 3.5f, 1.4f, 0.2f};
float[] probabilities = neuralNet.predict(flower);

int predictedClass = 0;
for (int i = 1; i < probabilities.length; i++) {
    if (probabilities[i] > probabilities[predictedClass]) {
        predictedClass = i;
    }
}

String species = CLASS_NAMES[predictedClass];
```

`CLASS_NAMES` must use the same order as the target columns used during training.

## Prediction checklist

- Supply the same number of features expected by the input layer.
- Preserve the original feature order and units.
- Use the exact preprocessing fitted during training.
- Map outputs to classes explicitly.
- Validate missing, non-finite, and out-of-range input before prediction.
- Treat a model score as an estimate, not a guaranteed fact.

??? info "See complete examples"
    - [Multiple Linear Regression](../examples/regression/multiple-linear-regression.md) predicts one numerical value.
    - [Logistic Regression](../examples/classification/logistic-regression.md) converts a Sonar probability into `ROCK` or `MINE` with a binary threshold.
    - [Spam Classification](../examples/classification/spam-classification.md) applies a binary threshold.
    - [Multiclass Classification](../examples/classification/multiclass-classification.md) maps Softmax outputs to a class.
