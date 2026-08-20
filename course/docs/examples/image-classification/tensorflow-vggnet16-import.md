[View Example on GitHub](https://github.com/deepnetts/cookbook-examples/tree/main/examples/img-classification/tensorflow-vggnet16-import)

# TensorFlow VGGNet16 Import

This walkthrough reconstructs VGGNet16 in Deep Netts, imports TensorFlow/Keras ImageNet weights, and classifies an image without retraining the model.

**Problem:** Classify an image as one of 1,000 ImageNet categories using pretrained TensorFlow weights.

**Dataset:** No training dataset is downloaded; the project bundles 1,000 ImageNet labels and small test images for inference.

## At a glance

| | |
|---|---|
| **ML task** | Pretrained image classification and model interoperability |
| **Input** | `224 × 224 × 3` BGR image |
| **Target** | One of 1,000 ImageNet labels |
| **Model** | VGGNet16 with 13 convolutional and three fully connected layers |
| **Preprocessing** | Resize, convert RGB to BGR, and subtract ImageNet channel means |
| **Training** | None; pretrained TensorFlow weights are imported |
| **Download** | Approximately 600 MB on the first run |
| **Memory** | Approximately 7–8 GB Java heap |
| **Saved model** | `models/vggnet16.dnet` |

## 1. Configure the runtime

The program verifies Java 25 and the Vector API, disables CUDA, and prints the memory requirement. Use `-Xmx8g`; the epoch property does not apply because there is no training.

## 2. Reconstruct VGGNet16

```java
ConvolutionalNetwork.builder()
        .addInputLayer(224, 224, 3)
        // five convolution/pooling blocks: 64, 128, 256, 512, 512 filters
        .addFullyConnectedLayer(4_096)
        .addFullyConnectedLayer(4_096)
        .addOutputLayer(1_000, ActivationType.SOFTMAX)
        .hiddenActivationFunction(ActivationType.RELU)
        .lossFunction(LossType.CROSS_ENTROPY)
        .build();
```

The layer sequence must exactly match the network that produced the exported weights. See the runnable class for all 13 convolutional layers.

## 3. Download, cache, and import weights

```java
Path weights = VggWeightsDownloader.obtain(CACHE_DIRECTORY);
TensorflowUtils.importWeights(vggNet16, weights.toString());
```

The downloader reuses a valid cache, writes new downloads to a `.part` file, checks HTTP failure, atomically renames the completed archive, and prevents ZIP entries from escaping the cache directory. Generated archives and models remain outside Git.

## 4. Load ImageNet labels and save

```java
String[] labels = Files.readString(LABELS_PATH).trim().split("\\s*,\\s*");
if (labels.length != 1_000) {
    throw new IllegalStateException("Expected 1,000 ImageNet labels");
}
vggNet16.setOutputLabels(labels);
vggNet16.save("models/vggnet16.dnet");
```

Only the 1,000 label names and small test images are bundled. The ImageNet training dataset is never downloaded.

## 5. Apply VGG preprocessing

`VggNet16InputImage` resizes an image to `224 × 224`, changes RGB to BGR channel order, and subtracts the ImageNet means `103.939`, `116.779`, and `123.68`. Imported models must receive inputs prepared exactly like their original training inputs.

## 6. Run inference

```java
Path imagePath = args.length > 0 ? Path.of(args[0]) : DEFAULT_IMAGE;
VggNet16InputImage image = new VggNet16InputImage(imagePath);
float[] probabilities = vggNet16.predict(image.getInput()).getValues();
int predictedIndex = indexOfLargest(probabilities);
System.out.println(labels[predictedIndex]);
```

The complete example also warms up the JVM and reports confidence and measured inference time before shutting down the network thread pool.

## Run in NetBeans

Use **Project Properties → Run → VM Options**:

```text
--add-modules=jdk.incubator.vector -Xmx8g
```

Without arguments the example uses `elephant.jpg`. To classify another file, add its absolute path under **Arguments**. The first run requires internet access and can take significantly longer due to the weight download and import.

<div class="github-project-action"><a href="https://github.com/deepnetts/cookbook-examples/tree/main/examples/img-classification/tensorflow-vggnet16-import">View Example on GitHub</a></div>

<a class="back-button" href="./">← Back to Image Classification Examples</a>
