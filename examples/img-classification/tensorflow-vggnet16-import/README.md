# TensorFlow VGGNet16 Import with Deep Netts

This Java 25 example reconstructs VGGNet16 in Deep Netts, imports weights from
the TensorFlow/Keras ImageNet model, saves the imported `.dnet` model, and uses
it to classify an image into one of 1,000 ImageNet categories.

This is an interoperability and inference example. It does **not** train
VGGNet16 and it does not download the ImageNet training dataset. Small test
images and the 1,000 output labels from the original
[Deep Netts examples repository](https://github.com/deepnetts/examples) are
bundled under `src/main/resources/datasets/vggnet`.

## Resource requirements

- The exported TensorFlow weights download is approximately 600 MB.
- Import requires approximately 7-8 GB of Java heap.
- The weights are downloaded once into `models/cache/`; generated files under
  `models/` are ignored by Git.
- CPU inference is slow. CUDA can be enabled in the source when a compatible
  Deep Netts/CUDA environment is available.

## Run

```bash
MAVEN_OPTS="--add-modules jdk.incubator.vector -Xmx8g" \
  mvn clean compile exec:java
```

Use a custom image by passing its path:

```bash
MAVEN_OPTS="--add-modules jdk.incubator.vector -Xmx8g" \
  mvn compile exec:java -Dexec.args="/absolute/path/to/image.jpg"
```

Without an argument, the bundled `elephant.jpg` is used. The imported network
is saved to `models/vggnet16.dnet`.

The first run needs internet access. A failed or interrupted download leaves no
final cache archive; rerunning the command starts a clean download.

## NetBeans

Open this directory as a Maven project, keep it as the working directory, and
use these **VM Options**:

```text
--add-modules=jdk.incubator.vector -Xmx8g
```

To classify a custom image, put its absolute path under **Arguments**. The
`deepnetts.epochs` property is not used because this example does not train.

## Import and inference flow

The program rebuilds all five VGG convolution/pooling blocks, two 4,096-neuron
layers, and the 1,000-class Softmax output. The downloader caches a completed
archive, uses a temporary file for interrupted downloads, and rejects unsafe
ZIP paths. After `TensorflowUtils.importWeights`, it validates all 1,000 labels
and saves the imported network.

Input preprocessing matches VGG: resize to `224x224`, use BGR channel order,
and subtract the ImageNet channel means. Output includes the predicted label,
confidence, and inference time. Generated models, archives, and extracted
weights under `models/` are ignored by Git.
