# Developer Guide

Use the Developer Guide when you know what you want to build and need focused instructions for completing a specific task with the Deep Netts API.

This section complements the rest of the site:

- [Getting Started](../getting-started/index.md) installs and verifies Deep Netts;
- [Examples](../examples/index.md) explain complete runnable projects;
- [Course](../lectures/01-ml-basics.md) teaches the Machine Learning concepts behind the code;
- the Developer Guide provides short, task-oriented API recipes.

## Choose a task

The guide will follow the same practical workflow used by the complete examples:

| Task | What the guide will help you do |
|---|---|
| [Load data](loading-data.md) | Read a prepared tabular dataset and identify input and target columns |
| [Prepare data](preparing-data.md) | Shuffle, split, standardize, or scale data without leakage |
| [Create a model](creating-model.md) | Build a network whose output matches a regression or classification task |
| [Train a model](training-model.md) | Configure a trainer and run a reproducible training process |
| [Evaluate a model](evaluating-model.md) | Measure performance on samples that were not used for training |
| [Save and load a model](saving-loading.md) | Preserve the trained network together with its preprocessing |
| [Make predictions](making-predictions.md) | Transform new input correctly and interpret the model output |

Each guide will focus on one development task, show only the relevant Java code, explain the important API choices, and link to a complete example where the task is used in context.

## Start with the current material

Alongside the available task guides, these pages provide the wider context:

- [Deep Netts API](../lectures/03-deep-netts-api.md) maps the Machine Learning workflow to the main Java classes and methods.
- [Model Development](../lectures/04-model-development.md) explains the order of the complete workflow and why it matters.
- [Examples](../examples/index.md) lets you choose a complete walkthrough and runnable Maven project.
