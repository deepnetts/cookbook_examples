# Regression Examples

Regression models predict continuous numerical values. Start here when the answer to your problem is a quantity such as time, price, performance, or demand rather than a category.

## Choose a project

| Example | Inputs | Target | Best first use |
|---|---:|---|---|
| [Simple Linear Regression](linear-regression.md) | 1 | Sorting execution time | Learn the smallest complete regression workflow |
| [Multiple Linear Regression](multiple-linear-regression.md) | 6 | Computer performance (`PRP`) | Learn how several features contribute to one prediction |

## Recommended order

Start with Simple Linear Regression. Its `1 -> 1` model makes the relationship between a feature and target easy to see. Continue with Multiple Linear Regression to apply the same workflow to six input features.

Both projects demonstrate:

- a reproducible train/test split;
- preprocessing fitted only on training data;
- a linear output and Mean Squared Error;
- regression evaluation on unseen samples;
- saving preprocessing with the model;
- prediction with the original feature order.

[Back to all examples](../index.md) · [How to run the projects](../running-examples.md)
