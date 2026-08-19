# Saving and Loading a Model

Save the trained network so it can make predictions without retraining every time the application starts.

## Attach preprocessing

If training used a fitted standardizer or scaler, attach it before saving:

```java
neuralNet.setNormalizer(standardizer);
```

For Min-Max scaling, attach the scaler instead:

```java
neuralNet.setNormalizer(scaler);
```

This keeps the model and its input transformation together as one prediction pipeline.

## Save the model

Create the destination directory and save the network:

```java
import java.nio.file.Files;
import java.nio.file.Path;

private static final String MODEL_PATH = "models/model.dnet";

Files.createDirectories(Path.of("models"));
neuralNet.save(MODEL_PATH);
```

## Load the model

Load the saved network with the expected model class:

```java
import deepnetts.net.FeedForwardNetwork;
import deepnetts.util.FileIO;

FeedForwardNetwork neuralNet = FileIO.createFromFile(
        MODEL_PATH,
        FeedForwardNetwork.class
);
```

`createFromFile(...)` can throw `IOException` and `ClassNotFoundException`; handle or declare them according to the surrounding application.

## Verify the saved artifact

- Keep the `.dnet` file outside temporary build directories.
- Record which Deep Netts version created the model.
- Preserve the feature order and class-name mapping used during training.
- Run a known prediction after loading and compare it with the original model.
- Do not attach a newly fitted preprocessor when the saved model already contains the original one.

## See it in practice

[Logistic Regression](../examples/classification/logistic-regression.md) creates the model directory and saves its trained network with `FileIO` as the final reusable artifact.
