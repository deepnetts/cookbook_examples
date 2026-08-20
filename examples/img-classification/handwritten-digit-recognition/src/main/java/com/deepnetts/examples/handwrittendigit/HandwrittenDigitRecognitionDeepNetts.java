package com.deepnetts.examples.handwrittendigit;

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

/** Multi-class image classification of MNIST digits from 0 to 9. */
public class HandwrittenDigitRecognitionDeepNetts {
    public static void main(String[] args) throws Exception {
        int width = 28, height = 28;
        int epochs = Integer.getInteger("deepnetts.epochs", 10);
        String dataset = "src/main/resources/datasets/mnist";
        // 1. Runtime configuration
        System.setProperty("java.awt.headless", "true");
        DeepNetts.getInstance().setUseCuda(false);

        // 2. Load and preprocess grayscale images
        ImageSet images = ImageData.load(dataset, "index.txt", width, height, true, true);
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
                .addInputLayer(width, height, 1)
                .addConvolutionalLayer(12, Filters.ofSize(5))
                .addMaxPoolingLayer(2, 2)
                .addConvolutionalLayer(24, Filters.ofSize(5))
                .addMaxPoolingLayer(2, 2)
                .addFullyConnectedLayer(60)
                .addFullyConnectedLayer(60)
                .addOutputLayer(10, ActivationType.SOFTMAX)
                .hiddenActivationFunction(ActivationType.RELU)
                .lossFunction(LossType.CROSS_ENTROPY)
                .randomSeed(42)
                .build();

        network.getTrainer().setStopEpochs(epochs).setLearningRate(0.001f)
                .setOptimizer(OptimizerType.ADAM).setBatchMode(true)
                .setBatchSize(32).setShuffle(true);
        // 6. Configure and train
        network.train(trainingSet);
        // 7. Evaluate
        System.out.println(network.test(testSet));

        // 8. Save model
        Files.createDirectories(Path.of("models"));
        network.save("models/mnist-classifier.dnet");
        // 9. Use trained model
        ExampleImage image = testSet.get(0);
        float[] probabilities = network.predict(image.getInput()).getValues();
        int prediction = maxIndex(probabilities);
        System.out.println("Actual digit: " + image.getLabel());
        System.out.println("Predicted digit: " + prediction);
        System.out.printf("Confidence: %.4f%n", probabilities[prediction]);
        // 10. Release resources
        network.getThreadPool().shutdown();
    }

    private static int maxIndex(float[] values) {
        int max = 0;
        for (int i = 1; i < values.length; i++)
            if (values[i] > values[max]) max = i;
        return max;
    }
}
