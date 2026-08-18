package com.deepnetts.examples.helloworld;

import deepnetts.net.FeedForwardNetwork;
import deepnetts.net.layers.activation.ActivationType;
import deepnetts.net.loss.LossType;

public class DeepNettsHelloWorld {

    public static void main(String[] args) {
        String javaVersion = System.getProperty("java.version");
        boolean vectorApiEnabled = ModuleLayer.boot()
                .findModule("jdk.incubator.vector")
                .isPresent();

        System.out.println("Java version: " + javaVersion);
        System.out.println("Vector API enabled: " + vectorApiEnabled);

        if (Runtime.version().feature() != 25) {
            throw new IllegalStateException("Java 25 is required. Maven is using Java "
                    + Runtime.version().feature() + ".");
        }
        if (!vectorApiEnabled) {
            throw new IllegalStateException(
                    "Vector API is not enabled. Run Maven with --add-modules jdk.incubator.vector.");
        }

        FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
                .addInputLayer(1)
                .addOutputLayer(1, ActivationType.LINEAR)
                .lossFunction(LossType.MEAN_SQUARED_ERROR)
                .randomSeed(42)
                .build();

        float input = 1.0f;
        float prediction = neuralNet.predict(new float[]{input})[0];

        if (!Float.isFinite(prediction)) {
            throw new IllegalStateException("Deep Netts returned a non-finite prediction.");
        }

        System.out.println("Deep Netts prediction for " + input + ": " + prediction);
        System.out.println("SUCCESS: Deep Netts is installed and configured correctly.");
    }
}
