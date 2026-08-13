# Deep Netts Cookbook Examples

Learn Machine Learning concepts and run complete Java examples with [Deep Netts](https://www.deepnetts.com/).

This repository is intended primarily for experienced Java developers who are new to Machine Learning. It keeps the Java code compact while explaining the concepts and decisions behind the complete model-development workflow.

## Learning structure

The repository currently provides two complementary levels:

```text
Deep Netts Course
LEARN THE CONCEPT
        |
        v
Complete Maven Examples
RUN THE PROJECT
```

A separate code-first, step-by-step learning resource may be added later. The complete runnable projects in this repository remain the source of truth for implementations and datasets.

## Deep Netts Course

The MkDocs course is located in [`course/`](course/). It introduces:

- Machine Learning basics,
- neural networks,
- the Deep Netts API,
- the complete model-development workflow,
- essential Machine Learning terminology.

Run the course locally:

```bash
cd course
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve -a 127.0.0.1:8002
```

Then open <http://127.0.0.1:8002>.

## Complete examples

Each example is a standalone Maven project with its own Java program, dataset, and detailed README.

### [Computer Hardware Performance Regression](examples/linear-regression/)

Predicts published relative computer performance (`PRP`) from six hardware characteristics. It demonstrates multiple linear regression and the workflow:

```text
load -> inspect -> split -> standardize -> train -> evaluate -> save -> predict
```

### [Email Spam Classification](examples/spam-classification/)

Predicts whether an email is spam from five numerical features. It demonstrates binary classification with a feed-forward neural network and the workflow:

```text
load -> inspect -> split -> scale -> train -> evaluate -> save -> predict
```

## Repository structure

```text
cookbook-examples/
├── course/                 # Concept-focused MkDocs course
└── examples/
    ├── linear-regression/  # Complete regression Maven project
    └── spam-classification/ # Complete classification Maven project
```

Start with the [course](course/docs/index.md) to learn the concepts, then open either example to run the complete workflow.
