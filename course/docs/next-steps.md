# Next Steps

You now have two complementary ways to work with the material in this repository:

```text
Deep Netts Course
= LEARN THE CONCEPT

Complete Maven Examples
= RUN THE COMPLETE PROJECT
```

Use the course when you need to understand terminology, architecture, preprocessing, training, or evaluation. Use the standalone projects when you want to execute the complete workflow and inspect the source code and datasets.

## Learn Through Code

A separate **Learn Through Code** repository is planned as the bridge between the course and the complete projects:

```text
MkDocs Course
LEARN
   |
   v
Learn Through Code
BUILD STEP BY STEP
   |
   v
Complete Maven Examples
RUN
```

That repository will build each program progressively with more code than theory and short explanations between code sections.

Each example will use one README for its complete walkthrough:

```text
learn-through-code/
├── README.md
├── linear-regression/
│   └── README.md
└── spam-classification/
    └── README.md
```

A walkthrough will not be split into many small files. One README will cover the full path from loading the dataset to making a prediction, then link to the corresponding runnable Maven project in this repository.

The separate repository is not part of the current course and is not created here.

## Continue with the runnable projects

Until the code-first walkthroughs are published, use the detailed READMEs already included with the examples:

- [Computer Hardware Performance Regression](https://github.com/deepnetts/cookbook-examples/tree/main/examples/linear-regression)
- [Email Spam Classification](https://github.com/deepnetts/cookbook-examples/tree/main/examples/spam-classification)

When adapting an example, keep the complete workflow intact: split before fitting preprocessing, evaluate on unseen data, save preprocessing with the model, and preserve feature order during prediction.

[Previous: Glossary](glossary.md) · [Return to Course Home](index.md)
