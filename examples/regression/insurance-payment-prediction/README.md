# Insurance Payment Prediction with Deep Netts

Complete Java 25 simple linear regression workflow for predicting total Swedish auto-insurance payments from the number of claims.

## Run this example

**Requirements:** Java 25 or newer, Maven, and Git. If you are not sure they are installed, follow [Check your environment](../../../README.md#1-check-your-environment) first.

Maven downloads Deep Netts Community Edition (`com.deepnetts:deepnetts-core:4.0.5`) from Maven Central on the first build. No separate installation or extra JVM option is needed.

**1. Open the example folder.** From the `cookbook-examples` folder (the repository root), run:

```bash
cd examples/regression/insurance-payment-prediction
```

**2. Build and run the example:**

```bash
mvn clean compile exec:java
```

**3. Check the result.** The run takes about 5 seconds. Its last lines look like this:

```text
Samples: 63
...
Predicted normalized payment: 0.2446
```

Training progress and metrics are printed in between. The exact numbers can differ slightly between computers. On systems that use a decimal comma (for example Serbian or German Windows), numbers are printed as `0,9978` instead of `0.9978`.

**Generated files:** `models/insurance-payment-regression.dnet`. Running the example again overwrites the generated files. The `models/` and `target/` folders are ignored by Git.

Go back to the repository root when you are done:

```bash
cd ../../..
```

### If something goes wrong

- **`'mvn' is not recognized` or `mvn: command not found`** - Maven is not installed or not on the `PATH`. Follow [Maven](../../../README.md#maven), open a new terminal, and run `mvn --version` again.
- **`release version 25 not supported` or `Java 25 or newer is required`** - Maven runs on an older Java. Install JDK 25 and point `JAVA_HOME` to it, as described in [Java 25 or newer](../../../README.md#java-25-or-newer).
- **`Could not resolve dependencies` or `Could not transfer artifact com.deepnetts:deepnetts-core`** - Maven cannot reach Maven Central. Check the internet connection and any proxy or mirror in `~/.m2/settings.xml`, then force Maven to try again:

```bash
mvn -U clean compile exec:java
```
- **`NoSuchFileException` or `FileNotFoundException` for `src/main/resources/datasets/...`** - the command was not started from the example folder. Go back to the repository root, run the `cd` command from step 1, and run the example again.
- `WARNING: A terminally deprecated method in sun.misc.Unsafe has been called` at the start of a Maven command is printed by Maven itself on Java 24 and newer. It is harmless; ignore it.

More fixes are listed in [Troubleshooting](../../../README.md#troubleshooting).

### Run it in Apache NetBeans

1. Choose **File -> Open Project** and select the `examples/regression/insurance-payment-prediction` folder.
2. Click **Run Project** (F6). NetBeans uses the project folder as the working directory, so the dataset paths work without changes.

## Problem and dataset

The bundled dataset contains 63 normalized pairs. The first value is the number of claims and the second is total payment for all claims. It comes from the Swedish Auto Insurance dataset used by the original Deep Netts examples.

Source: <https://github.com/deepnetts/examples/blob/main/datasets/SweedenAutoInsurance.csv>

## Workflow

The Java class loads the CSV, creates a reproducible 80/20 split, standardizes from training statistics, trains a `1 -> 1` linear network, evaluates it, saves the model with preprocessing, and predicts payment for a new claim count.
