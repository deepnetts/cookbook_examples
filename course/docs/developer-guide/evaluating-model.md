# Evaluating a Model

Evaluate after training using the reserved test set. The test samples must not have been used to fit the model or preprocessing parameters.

## Regression metrics

```java
import deepnetts.eval.RegressionMetrics;

RegressionMetrics metrics =
        (RegressionMetrics) neuralNet.test(testSet);

System.out.println(metrics);
System.out.println("MAE: " + metrics.getMeanAbsoluteError());
System.out.println("RMSE: " + metrics.getRootMeanSquaredError());
System.out.println("R2: " + metrics.getR2());
```

- MAE reports the average absolute prediction error.
- RMSE penalizes larger errors more strongly.
- R² indicates how much target variation the model explains.

Interpret errors in the target's real unit and compare them with a simple baseline.

## Classification metrics

```java
import deepnetts.eval.ClassificationMetrics;

ClassificationMetrics metrics =
        (ClassificationMetrics) neuralNet.test(testSet);

System.out.println(metrics);
System.out.println("Accuracy: " + metrics.getAccuracy());
System.out.println("Precision: " + metrics.getPrecision());
System.out.println("Recall: " + metrics.getRecall());
System.out.println("F1: " + metrics.getF1Score());
```

Accuracy alone can hide poor behavior when classes are imbalanced. Inspect precision, recall, F1, and the confusion matrix according to the cost of false positives and false negatives.

??? warning "Evaluation rules"
    - Apply the preprocessing fitted on `trainingSet` to `testSet`.
    - Never tune repeatedly against the final test result.
    - Compare models using the same split and random seeds.
    - Treat unexpectedly strong results as a reason to check for leakage.

??? info "See it in practice"
    - [Logistic Regression](../examples/classification/sonar-rock-mine-classification.md) evaluates rock-or-mine decisions with binary classification metrics.
    - [Multiclass Classification](../examples/classification/iris-flower-classification.md) evaluates a three-class Softmax model.
    - [Duke Logo Recognition](../examples/image-classification/duke-logo-recognition.md) evaluates a binary CNN on held-out images.
    - [Credit Card Fraud Detection](../examples/classification/credit-card-fraud-detection.md) highlights precision and recall for a fraud classifier.
    - [Insurance Payment Prediction](../examples/regression/insurance-payment-prediction.md) evaluates a one-feature regression model.
    - [House Price Prediction](../examples/regression/house-price-prediction.md) evaluates nonlinear regression on held-out housing data.
