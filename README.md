# Deep Netts Cookbook Examples

Learn Machine Learning concepts and run complete Java examples with [Deep Netts](https://www.deepnetts.com/).

This repository is intended primarily for experienced Java developers who are new to Machine Learning. It keeps the Java code compact while explaining the concepts and decisions behind the complete model-development workflow.

## Learning structure

The repository provides three complementary levels:

```text
Deep Netts Course
LEARN THE CONCEPT
        |
        v
Examples
EXPLORE THE WORKFLOW
        |
        v
Complete Maven Examples
RUN THE PROJECT
```

The Examples pages use focused snippets to explain the important workflow steps, then link to the complete runnable projects and datasets.

## Deep Netts Course

The source for the hosted MkDocs course is located in [`course/`](course/). Learners follow the published website; they do not need to clone this repository just to read the course.

The current course includes:

- Getting Started: prerequisites, download, installation, and Hello World;
- an Examples gallery with regression and classification projects;
- Machine Learning and neural-network learning material;
- Deep Netts API and model-development introductions;
- an essential Machine Learning glossary.

The public course URL must be added here once its final deployment location is confirmed.

### Preview the course locally

The following commands are for course contributors and maintainers:

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

### [Deep Netts Hello World](examples/hello-world/)

Creates a minimal neural network and runs one prediction to verify Java, Maven, the Deep Netts dependencies, licensing, and Vector API runtime configuration before starting a complete Machine Learning workflow.

### [Sorting Execution Time - Simple Linear Regression](examples/regression/linear-regression/)

Predicts sorting execution time from one numerical feature, `comparison_count`. It demonstrates simple linear regression and the workflow:

```text
load -> inspect -> split -> standardize -> train -> evaluate -> save -> predict
```

### [Computer Hardware Performance - Multiple Linear Regression](examples/regression/multiple-linear-regression/)

Predicts published relative computer performance (`PRP`) from six hardware characteristics. It demonstrates multiple linear regression and the workflow:

```text
load -> inspect -> split -> standardize -> train -> evaluate -> save -> predict
```

### [Email Spam Classification](examples/classification/spam-classification/)

Predicts whether an email is spam from five numerical features. It demonstrates binary classification with a feed-forward neural network and the workflow:

```text
load -> inspect -> split -> scale -> train -> evaluate -> save -> predict
```

### [Logistic Regression](examples/classification/logistic-regression/)

Provides a Java 25 binary-classification scaffold with a Sigmoid output and Cross-Entropy loss. Add a numerical CSV dataset and configure its feature count before running it.

### [Iris Multiclass Classification](examples/classification/multiclass-classification/)

Predicts one of three Iris flower species from four numerical measurements. It demonstrates multiclass classification with one-hot targets, a softmax output layer, and the workflow:

```text
load -> inspect -> split -> scale -> train -> evaluate -> save -> predict
```

## Repository structure

```text
cookbook-examples/
├── course/
│   ├── docs/
│   │   ├── getting-started/ # Setup and installation verification
│   │   ├── examples/        # Example gallery and walkthroughs
│   │   ├── lectures/        # Machine Learning learning material
│   │   └── glossary.md
│   └── mkdocs.yml           # Website navigation and configuration
└── examples/
    ├── hello-world/        # Minimal installation verification project
    ├── regression/
    │   ├── linear-regression/
    │   └── multiple-linear-regression/
    ├── classification/
    │   ├── logistic-regression/
    │   ├── spam-classification/
    │   └── multiclass-classification/
    ├── img-classification/ # Future image-classification projects
    └── nlp/                # Future NLP and language-model projects
```

Start with the [course](course/docs/index.md), verify the installation with Hello World, then choose an example to explore and run a complete workflow.
