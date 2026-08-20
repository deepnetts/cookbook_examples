package com.deepnetts.examples.hotdognothotdog;

import com.deepnetts.examples.image.ImageData;
import deepnetts.core.DeepNetts;
import deepnetts.data.ExampleImage;
import deepnetts.data.ImageSet;
import deepnetts.net.ConvolutionalNetwork;
import deepnetts.net.layers.Filters;
import deepnetts.net.layers.activation.ActivationType;
import deepnetts.net.loss.LossType;
import deepnetts.net.train.opt.OptimizerType;
import java.nio.file.Files;
import java.nio.file.Path;

/** Binary image classification: hot dog or not hot dog. */
public class HotDogImageClassificationDeepNetts {
    public static void main(String[] args) throws Exception {
        int width = 64, height = 64;
        int epochs = Integer.getInteger("deepnetts.epochs", 10);
        String dataset = "src/main/resources/datasets/hotdog-dataset";
        // 1. Runtime configuration
        System.setProperty("java.awt.headless", "true");
        DeepNetts.getInstance().setUseCuda(false);

        // 2. Load and preprocess images
        ImageSet images = ImageData.load(dataset, "index.txt", width, height, false, false);
        // 3. Inspect data
        System.out.println("Images: " + images.size());
        System.out.println("Images by class: " + images.countByClasses());
        // 4. Shuffle and split
        images.shuffle(42);
        ImageSet[] split = images.split(0.8, 0.2);
        ImageSet trainingSet = split[0];
        ImageSet testSet = split[1];

        // 5. Build model
        ConvolutionalNetwork network = ConvolutionalNetwork.builder()
                .addInputLayer(width, height, 3)
                .addConvolutionalLayer(6, Filters.ofSize(3))
                .addMaxPoolingLayer(2, 2)
                .addFullyConnectedLayer(16)
                .addOutputLayer(1, ActivationType.SIGMOID)
                .hiddenActivationFunction(ActivationType.LEAKY_RELU)
                .lossFunction(LossType.CROSS_ENTROPY)
                .randomSeed(42)
                .build();

        // 6. Configure and train
        network.getTrainer().setStopEpochs(epochs).setLearningRate(0.001f)
                .setOptimizer(OptimizerType.ADAM).setBatchMode(true)
                .setBatchSize(16).setShuffle(true);
        network.train(trainingSet);
        // 7. Evaluate
        System.out.println(network.test(testSet));

        // 8. Save model
        Files.createDirectories(Path.of("models"));
        network.save("models/hotdog-classifier.dnet");
        // 9. Use trained model
        ExampleImage image = testSet.get(0);
        float probability = network.predict(image.getInput()).getValues()[0];
        System.out.println("Actual: " + image.getLabel());
        System.out.println("Predicted: " + (probability >= 0.5f ? "hot_dog" : "negative"));
        System.out.printf("Hot-dog probability: %.4f%n", probability);
        // 10. Release resources
        network.getThreadPool().shutdown();
    }
}
