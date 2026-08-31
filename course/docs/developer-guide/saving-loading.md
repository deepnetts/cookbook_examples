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

Load a saved CNN with its own model class:

```java
import deepnetts.net.ConvolutionalNetwork;

ConvolutionalNetwork network = FileIO.createFromFile(
        "models/image-classifier.dnet",
        ConvolutionalNetwork.class
);
```

Saving the network does not remove the image input contract. Keep the expected
width, height, channel order, value scaling, and class-label order alongside the
model artifact.

## Verify the saved artifact

- Keep the `.dnet` file outside temporary build directories.
- Record which Deep Netts version created the model.
- Preserve the feature order and class-name mapping used during training.
- For a CNN, preserve image dimensions, channel count and order, scaling, and label mapping.
- Run a known prediction after loading and compare it with the original model.
- Do not attach a newly fitted preprocessor when the saved model already contains the original one.
