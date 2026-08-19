package com.deepnetts.examples.parkinglotoccupancy;

import deepnetts.core.DeepNetts;
import deepnetts.data.ExampleImage;
import deepnetts.data.ImageSet;
import deepnetts.eval.ClassificationMetrics;
import deepnetts.net.ConvolutionalNetwork;
import deepnetts.net.layers.Filters;
import deepnetts.net.layers.activation.ActivationType;
import deepnetts.net.loss.LossType;
import deepnetts.net.train.opt.OptimizerType;
import deepnetts.tensor.Tensor1D;
import deepnetts.util.ImageUtils;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Stream;

/*
 * Problem: Determine whether a parking-space image is occupied.
 * Dataset: 3,621 busy and 2,550 negative image patches.
 */
public class ParkingLotOccupancyDeepNetts {

    // 0. Configuration
    private static final String DATASET_PATH =
            "src/main/resources/datasets/parking-lot";
    private static final String MODEL_PATH = "models/parking-occupancy.dnet";
    private static final int IMAGE_WIDTH = 48;
    private static final int IMAGE_HEIGHT = 48;
    private static final int STOP_EPOCHS =
            Integer.getInteger("deepnetts.epochs", 3);

    public static void main(String[] args) throws Exception {
        System.setProperty("java.awt.headless", "true");
        verifyJavaRuntime();
        ConvolutionalNetwork neuralNet = null;

        try {
            // 1. Runtime configuration
            DeepNetts.getInstance().setUseCuda(false);

            // 2. Load data
            ImageSet imageSet = loadImageSet(Path.of(DATASET_PATH));

            // 3. Inspect data
            System.out.println("Images: " + imageSet.size());
            System.out.println("Classes: " + imageSet.countByClasses());

            // 4. Shuffle and split
            imageSet.shuffle(42);
            ImageSet[] split = imageSet.split(0.8, 0.2);
            ImageSet trainingSet = split[0];
            ImageSet testSet = split[1];
            System.out.println("Training images: " + trainingSet.size());
            System.out.println("Test images: " + testSet.size());

            // 5. Preprocess
            // Images are resized to 48x48 and converted to RGB values in [0, 1].

            // 6. Build model
            neuralNet = ConvolutionalNetwork.builder()
                    .addInputLayer(IMAGE_WIDTH, IMAGE_HEIGHT, 3)
                    .addConvolutionalLayer(6, Filters.ofSize(3))
                    .addMaxPoolingLayer(2, 2)
                    .addFullyConnectedLayer(16)
                    .addOutputLayer(1, ActivationType.SIGMOID)
                    .hiddenActivationFunction(ActivationType.LEAKY_RELU)
                    .lossFunction(LossType.CROSS_ENTROPY)
                    .randomSeed(42)
                    .build();

            // 7. Configure and train
            System.out.println("Training epochs: " + STOP_EPOCHS);
            System.out.println(
                    "On CPU, each epoch can take approximately 45 seconds."
            );
            neuralNet.getTrainer()
                    .setStopEpochs(STOP_EPOCHS)
                    .setLearningRate(0.001f)
                    .setOptimizer(OptimizerType.ADAM)
                    .setBatchMode(true)
                    .setBatchSize(32)
                    .setShuffle(true);
            neuralNet.train(trainingSet);

            // 8. Evaluate
            ClassificationMetrics metrics =
                    (ClassificationMetrics) neuralNet.test(testSet);
            System.out.println(metrics);

            // 9. Save model
            Files.createDirectories(Path.of("models"));
            neuralNet.save(MODEL_PATH);
            System.out.println("Saved model: " + MODEL_PATH);

            // 10. Use trained model
            ExampleImage image = testSet.get(0);
            float occupiedProbability =
                    neuralNet.predict(image.getInput()).getValues()[0];
            String predictedClass = occupiedProbability >= 0.5f
                    ? "busy" : "negative";
            System.out.println("Test image: " + image.getFile().getName());
            System.out.println("Actual class: " + image.getLabel());
            System.out.printf("Occupied probability: %.4f%n", occupiedProbability);
            System.out.println("Predicted class: " + predictedClass);
        } finally {
            if (neuralNet != null) {
                neuralNet.getThreadPool().shutdown();
            }
        }
    }

    private static ImageSet loadImageSet(Path datasetDirectory)
            throws Exception {
        ImageSet imageSet = new ImageSet(IMAGE_WIDTH, IMAGE_HEIGHT);
        imageSet.setColumnNames("busy");
        loadClass(imageSet, datasetDirectory, "negative", 0f);
        loadClass(imageSet, datasetDirectory, "busy", 1f);
        if (imageSet.isEmpty()) {
            throw new IllegalStateException("No images found in " + datasetDirectory);
        }
        return imageSet;
    }

    private static void loadClass(ImageSet imageSet, Path root,
                                  String label, float target) throws Exception {
        Path directory = root.resolve(label);
        if (!Files.isDirectory(directory)) {
            throw new IllegalStateException("Missing class directory: " + directory);
        }
        List<Path> paths;
        try (Stream<Path> files = Files.list(directory)) {
            paths = files.filter(Files::isRegularFile)
                    .filter(ParkingLotOccupancyDeepNetts::isImage)
                    .sorted().toList();
        }
        for (Path path : paths) {
            BufferedImage source = ImageIO.read(path.toFile());
            if (source == null) {
                throw new IOException("Cannot read image: " + path);
            }
            BufferedImage resized = ImageUtils.scaleImage(
                    source, IMAGE_WIDTH, IMAGE_HEIGHT);
            ExampleImage image = new ExampleImage(
                    path.toFile(), resized, label);
            image.setTargetOutput(new Tensor1D(target));
            imageSet.add(image);
        }
    }

    private static boolean isImage(Path path) {
        String name = path.getFileName().toString().toLowerCase();
        return name.endsWith(".jpg") || name.endsWith(".jpeg")
                || name.endsWith(".png");
    }

    private static void verifyJavaRuntime() {
        if (Runtime.version().feature() != 25) {
            throw new IllegalStateException("Java 25 is required. Maven is using Java "
                    + Runtime.version().feature() + ".");
        }
        if (ModuleLayer.boot().findModule("jdk.incubator.vector").isEmpty()) {
            throw new IllegalStateException(
                    "Vector API is not enabled. Use --add-modules jdk.incubator.vector.");
        }
    }
}
