# Learn Through Code

Learn Through Code is the bridge between understanding Machine Learning concepts and running a finished Maven project.

```text
Course lectures
LEARN THE CONCEPT
        |
        v
Learn Through Code
BUILD THE PROGRAM STEP BY STEP
        |
        v
Complete examples
RUN THE PROJECT
```

Instead of presenting the complete Java class immediately, each walkthrough builds the program in small sections. Every section contains a focused snippet from the real example followed by a short explanation.

## Choose a walkthrough

### [Simple Linear Regression](linear-regression.md)

Build a model that estimates sorting execution time from one numerical feature.

You will create a `1 -> 1` linear network, train it using comparison counts and measured execution times, evaluate it with regression metrics, save it, and predict runtime for a new comparison count.

### [Multiple Linear Regression](multiple-linear-regression.md)

Build a model that predicts computer hardware performance from six numerical features.

You will create a `6 -> 1` linear network, train it on the Computer Hardware dataset, evaluate it with regression metrics, save it, and predict `PRP` for a new computer.

### [Spam Classification](spam-classification.md)

Build a neural network that predicts whether an email is spam from five numerical features.

You will create a `5 -> 32 -> 16 -> 1` network, train it on labeled email data, evaluate it with classification metrics, save it, and classify a new email.

## How to use the walkthroughs

Read each page from top to bottom. The snippets follow the order in the real `main` method, so every new section adds another part of the Machine Learning pipeline.

The walkthrough pages focus on building. The projects under `examples/` remain the source of truth for the complete runnable Java classes, datasets, Maven configuration, and detailed reference documentation.
