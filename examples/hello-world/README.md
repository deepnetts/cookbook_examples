# Deep Netts Hello World

This minimal Maven project verifies that Java 25 or newer, Maven, and Deep Netts Community Edition are configured correctly.

The program creates a small `1 -> 1` neural network and performs one prediction. It does not train a useful model; the complete examples cover model development workflows.

## Run this example

**Requirements:** Java 25 or newer, Maven, and Git. If you are not sure they are installed, follow [Check your environment](../../README.md#1-check-your-environment) first.

Maven downloads Deep Netts Community Edition (`com.deepnetts:deepnetts-core:4.0.5`) from Maven Central on the first build. No separate installation or extra JVM option is needed.

**1. Open the example folder.** From the `cookbook-examples` folder (the repository root), run:

```bash
cd examples/hello-world
```

**2. Build and run the example:**

```bash
mvn clean compile exec:java
```

**3. Check the result.** The run takes about 10 seconds (the first run also downloads Deep Netts and the Maven plugins, about 10 MB). Its last lines look like this:

```text
Java version: 25.0.4.1
Deep Netts prediction for 1.0: 0.34296894
SUCCESS: Deep Netts is installed and configured correctly.
```

The exact numbers can differ slightly between computers. On systems that use a decimal comma (for example Serbian or German Windows), numbers are printed as `0,9978` instead of `0.9978`.

Go back to the repository root when you are done:

```bash
cd ../..
```

### If something goes wrong

- **`'mvn' is not recognized` or `mvn: command not found`** - Maven is not installed or not on the `PATH`. Follow [Maven](../../README.md#maven), open a new terminal, and run `mvn --version` again.
- **`release version 25 not supported` or `Java 25 or newer is required`** - Maven runs on an older Java. Install JDK 25 and point `JAVA_HOME` to it, as described in [Java 25 or newer](../../README.md#java-25-or-newer).
- **`Could not resolve dependencies` or `Could not transfer artifact com.deepnetts:deepnetts-core`** - Maven cannot reach Maven Central. Check the internet connection and any proxy or mirror in `~/.m2/settings.xml`, then force Maven to try again:

```bash
mvn -U clean compile exec:java
```
- **`NoSuchFileException` or `FileNotFoundException` for `src/main/resources/datasets/...`** - the command was not started from the example folder. Go back to the repository root, run the `cd` command from step 1, and run the example again.
- `WARNING: A terminally deprecated method in sun.misc.Unsafe has been called` at the start of a Maven command is printed by Maven itself on Java 24 and newer. It is harmless; ignore it.

More fixes are listed in [Troubleshooting](../../README.md#troubleshooting).

### Run it in Apache NetBeans

1. Choose **File -> Open Project** and select the `examples/hello-world` folder.
2. Click **Run Project** (F6). NetBeans uses the project folder as the working directory, so the dataset paths work without changes.
