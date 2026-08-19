package com.deepnetts.examples.hotdognothotdog;

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
 * Problem: Binary image classification of hot-dog and non-hot-dog images.
 *
 * Dataset: 467 RGB images stored in one directory per class.
 *
 * Trains and evaluates a convolutional neural network, saves the trained
 * model, and uses the in-memory model to classify an unseen test image.
 */
public class HotDogImageClassificationDeepNetts {

    // 0. Configuration
    private static final String DATASET_PATH =
            "src/main/resources/datasets/hotdog-dataset";
    private static final String MODEL_PATH = "models/hotdog-classifier.dnet";

    private static final int IMAGE_WIDTH = 64;
    private static final int IMAGE_HEIGHT = 64;
    private static final int IMAGE_CHANNELS = 3;
    private static final int STOP_EPOCHS = Integer.getInteger("deepnetts.epochs", 10);

    public static void main(String[] args) throws Exception {
        System.setProperty("java.awt.headless", "true");
        verifyJavaRuntime();
        ConvolutionalNetwork neuralNet = null;

        try {
            // 1. Runtime configuration
            DeepNetts.getInstance().setUseCuda(false);

            // 2. Load and resize images
            ImageSet imageSet = loadImageSet(Path.of(DATASET_PATH));

            // 3. Inspect data
            System.out.println("Images: " + imageSet.size());
            System.out.println("Classes: " + imageSet.countByClasses());
            System.out.printf(
                    "Input shape: %dx%dx%d%n",
                    IMAGE_WIDTH,
                    IMAGE_HEIGHT,
                    IMAGE_CHANNELS
            );

            // 4. Shuffle and split
            imageSet.shuffle(42);
            ImageSet[] split = imageSet.split(0.8, 0.2);
            ImageSet trainingSet = split[0];
            ImageSet testSet = split[1];

            System.out.println("Training images: " + trainingSet.size());
            System.out.println("Test images: " + testSet.size());

            // 5. Preprocess
            // ExampleImage converts RGB channels to values in the [0, 1]
            // range. loadImageSet resizes every image before this conversion.

            // 6. Build model
            neuralNet = ConvolutionalNetwork.builder()
                    .addInputLayer(IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS)
                    .addConvolutionalLayer(6, Filters.ofSize(3))
                    .addMaxPoolingLayer(2, 2)
                    .addFullyConnectedLayer(16)
                    .addOutputLayer(1, ActivationType.SIGMOID)
                    .hiddenActivationFunction(ActivationType.LEAKY_RELU)
                    .lossFunction(LossType.CROSS_ENTROPY)
                    .randomSeed(42)
                    .build();

            // 7. Configure and train
            neuralNet.getTrainer()
                    .setStopEpochs(STOP_EPOCHS)
                    .setLearningRate(0.001f)
                    .setOptimizer(OptimizerType.ADAM)
                    .setBatchMode(true)
                    .setBatchSize(16)
                    .setShuffle(true);

            neuralNet.train(trainingSet);

            // 8. Evaluate on images not used for training
            ClassificationMetrics metrics =
                    (ClassificationMetrics) neuralNet.test(testSet);
            System.out.println(metrics);

            // 9. Save model
            Files.createDirectories(Path.of("models"));
            neuralNet.save(MODEL_PATH);
            System.out.println("Saved model: " + MODEL_PATH);

            // 10. Use trained model
            ExampleImage image = testSet.get(0);
            float hotDogProbability =
                    neuralNet.predict(image.getInput()).getValues()[0];
            String predictedClass = hotDogProbability >= 0.5f
                    ? "hot_dog"
                    : "negative";

            System.out.println("Test image: " + image.getFile().getName());
            System.out.println("Actual class: " + image.getLabel());
            System.out.printf("Hot-dog probability: %.4f%n", hotDogProbability);
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
        imageSet.setColumnNames("hot_dog");

        loadClassDirectory(imageSet, datasetDirectory, "negative", 0f);
        loadClassDirectory(imageSet, datasetDirectory, "hot_dog", 1f);

        if (imageSet.isEmpty()) {
            throw new IllegalStateException(
                    "No images found in " + datasetDirectory
            );
        }
        return imageSet;
    }

    private static void loadClassDirectory(ImageSet imageSet,
                                           Path datasetDirectory,
                                           String className,
                                           float target) throws Exception {
        Path classDirectory = datasetDirectory.resolve(className);
        if (!Files.isDirectory(classDirectory)) {
            throw new IllegalStateException(
                    "Missing image class directory: " + classDirectory
            );
        }

        List<Path> imagePaths;
        try (Stream<Path> files = Files.list(classDirectory)) {
            imagePaths = files
                    .filter(Files::isRegularFile)
                    .filter(HotDogImageClassificationDeepNetts::isImageFile)
                    .sorted()
                    .toList();
        }

        for (Path imagePath : imagePaths) {
            BufferedImage source = ImageIO.read(imagePath.toFile());
            if (source == null) {
                throw new IOException("Cannot read image: " + imagePath);
            }

            BufferedImage resized = ImageUtils.scaleImage(
                    source,
                    IMAGE_WIDTH,
                    IMAGE_HEIGHT
            );
            ExampleImage image = new ExampleImage(
                    imagePath.toFile(),
                    resized,
                    className
            );
            image.setTargetOutput(new Tensor1D(target));
            imageSet.add(image);
        }
    }

    private static boolean isImageFile(Path path) {
        String name = path.getFileName().toString().toLowerCase();
        return name.endsWith(".jpg")
                || name.endsWith(".jpeg")
                || name.endsWith(".png");
    }

    private static void verifyJavaRuntime() {
        if (Runtime.version().feature() != 25) {
            throw new IllegalStateException(
                    "Java 25 is required. Maven is using Java "
                    + Runtime.version().feature() + "."
            );
        }
        if (ModuleLayer.boot().findModule("jdk.incubator.vector").isEmpty()) {
            throw new IllegalStateException(
                    "Vector API is not enabled. Run Maven with "
                    + "--add-modules jdk.incubator.vector."
            );
        }
    }
}
