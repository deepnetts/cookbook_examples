package com.deepnetts.examples.helloworld;

import deepnetts.core.DeepNetts;
import deepnetts.net.FeedForwardNetwork;
import deepnetts.net.layers.activation.ActivationType;
import deepnetts.net.loss.LossType;

/**
 * Verifies that Deep Netts and its required runtime configuration are available.
 */
public class DeepNettsHelloWorld {

    public static void main(String[] args) {
        String javaVersion = System.getProperty("java.version");
        boolean vectorApiEnabled = ModuleLayer.boot()
                .findModule("jdk.incubator.vector")
                .isPresent();

        System.out.println("Java version: " + javaVersion);
        System.out.println("Vector API enabled: " + vectorApiEnabled);

        if (!vectorApiEnabled) {
            throw new IllegalStateException(
                    "The jdk.incubator.vector module is not enabled. "
                    + "Run Maven with MAVEN_OPTS=--add-modules jdk.incubator.vector."
            );
        }

        DeepNetts.getInstance().setUseCuda(false);

        FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
                .addInputLayer(1)
                .addOutputLayer(1, ActivationType.LINEAR)
                .lossFunction(LossType.MEAN_SQUARED_ERROR)
                .randomSeed(42)
                .build();

        float input = 1.0f;
        float prediction = neuralNet.predict(input)[0];

        if (!Float.isFinite(prediction)) {
            throw new IllegalStateException("Deep Netts returned an invalid prediction.");
        }

        System.out.printf("Deep Netts prediction for %.1f: %.6f%n", input, prediction);
        System.out.println("SUCCESS: Deep Netts is installed and configured correctly.");
    }
}
