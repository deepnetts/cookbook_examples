package com.deepnetts.examples.tensorflowvggnet;

import deepnetts.core.DeepNetts;
import deepnetts.net.ConvolutionalNetwork;
import deepnetts.net.layers.Filters;
import deepnetts.net.layers.activation.ActivationType;
import deepnetts.net.loss.LossType;
import deepnetts.util.TensorflowUtils;

import java.nio.file.Files;
import java.nio.file.Path;

/*
 * Imports TensorFlow-trained VGGNet16 weights and runs ImageNet inference.
 * This is an import/inference example; the model is not retrained locally.
 */
public class VggNet16TensorFlowImport {

    private static final Path CACHE_DIRECTORY = Path.of("models", "cache");
    private static final Path MODEL_PATH = Path.of("models", "vggnet16.dnet");
    private static final Path LABELS_PATH = Path.of(
            "src/main/resources/datasets/vggnet/labels.csv");
    private static final Path DEFAULT_IMAGE = Path.of(
            "src/main/resources/datasets/vggnet/test-images/elephant.jpg");

    public static void main(String[] args) throws Exception {
        System.setProperty("java.awt.headless", "true");
        verifyJavaRuntime();
        ConvolutionalNetwork vggNet16 = null;

        try {
            // 1. Runtime configuration
            DeepNetts.getInstance().setUseCuda(false);
            System.out.println("VGGNet16 import needs approximately 7-8 GB of heap.");

            // 2. Build the exact TensorFlow VGGNet16 architecture
            vggNet16 = buildVggNet16();

            // 3. Download/cache and import TensorFlow weights
            Path weights = VggWeightsDownloader.obtain(CACHE_DIRECTORY);
            TensorflowUtils.importWeights(vggNet16, weights.toString());
            System.out.println("Imported TensorFlow weights: " + weights);

            // 4. Load ImageNet output labels and 5. save the imported Deep Netts model
            Files.createDirectories(MODEL_PATH.getParent());
            String[] labels = Files.readString(LABELS_PATH).trim().split("\\s*,\\s*");
            if (labels.length != 1_000) {
                throw new IllegalStateException("Expected 1,000 ImageNet labels");
            }
            vggNet16.setOutputLabels(labels);
            vggNet16.save("models/vggnet16.dnet");
            System.out.println("Saved imported model: " + MODEL_PATH);

            // 6. Preprocess and classify an image
            Path imagePath = args.length > 0 ? Path.of(args[0]) : DEFAULT_IMAGE;
            VggNet16InputImage image = new VggNet16InputImage(imagePath);
            float[] probabilities = vggNet16.predict(image.getInput()).getValues();
            int predictedIndex = indexOfLargest(probabilities);
            System.out.println(labels[predictedIndex]);
            System.out.printf("Confidence: %.4f%n", probabilities[predictedIndex]);
        } finally {
            if (vggNet16 != null) {
                vggNet16.getThreadPool().shutdown();
            }
        }
    }

    private static ConvolutionalNetwork buildVggNet16() {
        return ConvolutionalNetwork.builder()
                .addInputLayer(224, 224, 3)
                .addConvolutionalLayer(64, Filters.ofSize(3))
                .addConvolutionalLayer(64, Filters.ofSize(3))
                .addMaxPoolingLayer(2, 2)
                .addConvolutionalLayer(128, Filters.ofSize(3))
                .addConvolutionalLayer(128, Filters.ofSize(3))
                .addMaxPoolingLayer(2, 2)
                .addConvolutionalLayer(256, Filters.ofSize(3))
                .addConvolutionalLayer(256, Filters.ofSize(3))
                .addConvolutionalLayer(256, Filters.ofSize(3))
                .addMaxPoolingLayer(2, 2)
                .addConvolutionalLayer(512, Filters.ofSize(3))
                .addConvolutionalLayer(512, Filters.ofSize(3))
                .addConvolutionalLayer(512, Filters.ofSize(3))
                .addMaxPoolingLayer(2, 2)
                .addConvolutionalLayer(512, Filters.ofSize(3))
                .addConvolutionalLayer(512, Filters.ofSize(3))
                .addConvolutionalLayer(512, Filters.ofSize(3))
                .addMaxPoolingLayer(2, 2)
                .addFullyConnectedLayer(4_096)
                .addFullyConnectedLayer(4_096)
                .addOutputLayer(1_000, ActivationType.SOFTMAX)
                .hiddenActivationFunction(ActivationType.RELU)
                .lossFunction(LossType.CROSS_ENTROPY)
                .build();
    }

    private static int indexOfLargest(float[] values) {
        int largestIndex = 0;
        for (int i = 1; i < values.length; i++) {
            if (values[i] > values[largestIndex]) {
                largestIndex = i;
            }
        }
        return largestIndex;
    }

    private static void verifyJavaRuntime() {
        if (Runtime.version().feature() < 25) {
            throw new IllegalStateException("Java 25 or newer is required. Maven is using Java "
                    + Runtime.version().feature() + ".");
        }
    }
}
