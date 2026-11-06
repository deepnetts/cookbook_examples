# TensorFlow VGGNet16 Import with Deep Netts

This Java 25 example reconstructs VGGNet16 in Deep Netts, imports weights from
the TensorFlow/Keras ImageNet model, saves the imported `.dnet` model, and uses
it to classify an image into one of 1,000 ImageNet categories.

This is an interoperability and inference example. It does **not** train
VGGNet16 and it does not download the ImageNet training dataset. Small test
images and the 1,000 output labels from the original
[Deep Netts examples repository](https://github.com/deepnetts/examples) are
bundled under `src/main/resources/datasets/vggnet`.

## Run this example

**Requirements:** Java 25 or newer, Maven, Git, a computer with at least 12 GB of RAM (the import uses an 8 GB Java heap), and an internet connection for the first run. If you are not sure the tools are installed, follow [Check your environment](../../../README.md#1-check-your-environment) first.

- Maven downloads Deep Netts Community Edition (`com.deepnetts:deepnetts-core:4.0.5`) from Maven Central on the first build.
- The first run downloads the TensorFlow VGGNet16 weights (about 600 MB) into `models/cache/`. Later runs reuse them.
- Community Edition runs on the CPU without Vector API or CUDA acceleration, so the import and the prediction take several minutes. GPU acceleration is part of the Free and Enterprise editions.

**1. Open the example folder.** From the `cookbook-examples` folder (the repository root), run:

```bash
cd examples/img-classification/tensorflow-vggnet16-import
```

**2. Give Maven an 8 GB heap and run the example.** Use the commands for your terminal.

macOS or Linux:

```bash
MAVEN_OPTS="-Xmx8g" mvn clean compile exec:java
```

Windows PowerShell (two commands):

```powershell
$env:MAVEN_OPTS="-Xmx8g"
```

```powershell
mvn clean compile exec:java
```

Windows Command Prompt (two commands):

```bat
set MAVEN_OPTS=-Xmx8g
```

```bat
mvn clean compile exec:java
```

To classify your own image, pass its absolute path. macOS or Linux:

```bash
MAVEN_OPTS="-Xmx8g" mvn compile exec:java "-Dexec.args=/absolute/path/to/image.jpg"
```

Windows (after setting `MAVEN_OPTS` as above):

```powershell
mvn compile exec:java "-Dexec.args=C:\path\to\image.jpg"
```

**3. Check the result.** The program prints the heap reminder, the download progress on the first run, the imported weights file, `Saved imported model: models/vggnet16.dnet`, and then the predicted ImageNet label with its confidence. For the bundled `elephant.jpg`, the label should be an elephant class such as `African_elephant`.

**Generated files:** `models/vggnet16.dnet` and the downloaded weights in `models/cache/`. The `models/` folder is ignored by Git.

Go back to the repository root when you are done:

```bash
cd ../../..
```

### If something goes wrong

- **`java.lang.OutOfMemoryError: Java heap space`** - `MAVEN_OPTS` was not set in this terminal, or the computer has too little memory. Set `MAVEN_OPTS` again in the same terminal and rerun; close other programs if the computer has less than 12 GB of RAM.
- **`Weights download failed with HTTP ...` or a timeout** - rerun the command; an interrupted download restarts cleanly. If it keeps failing, check that `https://www.dropbox.com` is reachable from your network, delete the cache folder, and run again. macOS or Linux:

```bash
rm -rf models/cache
```

  Windows PowerShell:

```powershell
Remove-Item -Recurse -Force models\cache
```
- **`Cannot read image`** - the path passed in `-Dexec.args` is wrong. Use an absolute path to a JPG or PNG file.
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

1. Choose **File -> Open Project** and select the `examples/img-classification/tensorflow-vggnet16-import` folder.
2. Right-click the project, choose **Properties -> Run**, and set **VM Options** to `-Xmx8g`. To classify your own image, put its absolute path in **Arguments**.
3. Click **Run Project** (F6).

## Import and inference flow

The program rebuilds all five VGG convolution/pooling blocks, two 4,096-neuron
layers, and the 1,000-class Softmax output. The downloader caches a completed
archive, uses a temporary file for interrupted downloads, and rejects unsafe
ZIP paths. After `TensorflowUtils.importWeights`, it validates all 1,000 labels
and saves the imported network.

Input preprocessing matches VGG: resize to `224x224`, use BGR channel order,
and subtract the ImageNet channel means. Output includes the predicted label
and its confidence. Generated models, archives, and extracted
weights under `models/` are ignored by Git.
