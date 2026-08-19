package com.deepnetts.examples.logisticregression;

import deepnetts.core.DeepNetts;
import deepnetts.data.DataSets;
import deepnetts.data.MLDataItem;
import deepnetts.data.TabularDataSet;
import deepnetts.data.TrainTestSplit;
import deepnetts.data.norm.MinMaxScaler;
import deepnetts.eval.ClassificationMetrics;
import deepnetts.net.FeedForwardNetwork;
import deepnetts.net.layers.activation.ActivationType;
import deepnetts.net.loss.LossType;
import deepnetts.net.train.opt.OptimizerType;
import deepnetts.util.FileIO;

import javax.visrec.ml.data.DataSet;
import java.nio.file.Files;
import java.nio.file.Path;
/*
 * Problem: Classify sonar signals as a rock or a mine.
 *
 * Dataset: 60 numerical input features and 1 binary target
 * (0 = rock, 1 = mine).
 *
 * Trains and evaluates a logistic-regression model, saves it and uses the
 * trained model for prediction.
 */
public class LogisticRegressionDeepNetts {

    // 0. Configuration
    private static final String DATASET_PATH =
            "src/main/resources/datasets/sonar.csv";

    private static final String MODEL_PATH =
            "models/logistic-regression.dnet";

    private static final int NUM_INPUTS = 60;
    private static final int NUM_OUTPUTS = 1;

    public static void main(String[] args) throws Exception {
        verifyJavaRuntime();
        
        // 1. Runtime configuration
        DeepNetts.getInstance().setUseCuda(false);

        // 2. Load data
        TabularDataSet<MLDataItem> dataSet =
                DataSets.readCsv(
                        DATASET_PATH,
                        NUM_INPUTS,
                        NUM_OUTPUTS,
                        false, // no header
                        ","    // delimiter
                );

        // 3. Inspect data
        System.out.println("Samples: " + dataSet.size());

        // 4. Shuffle and split
        dataSet.shuffle(42);

        TrainTestSplit split = dataSet.trainTestSplit(0.8);

        DataSet<MLDataItem> trainingSet = split.getTrainingSet();

        DataSet<MLDataItem> testSet = split.getTestSet();

        // 5. Preprocess
        MinMaxScaler scaler = DataSets.scaleToMinMax(trainingSet);

        scaler.apply(testSet);

        // 6. Build logistic-regression model
        FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
                .addInputLayer(NUM_INPUTS)
                .addOutputLayer(NUM_OUTPUTS, ActivationType.SIGMOID)
                .lossFunction(LossType.CROSS_ENTROPY)
                .randomSeed(42)
                .build();

        // 7. Configure and train
        neuralNet.getTrainer()
                .setStopEpochs(200)
                .setLearningRate(0.01f)
                .setOptimizer(OptimizerType.SGD)
                .setShuffle(true);

        neuralNet.train(trainingSet);

        // 8. Evaluate
        ClassificationMetrics metrics =
                (ClassificationMetrics) neuralNet.test(testSet);

        System.out.println(metrics);

        // 9. Save model
        Files.createDirectories(Path.of("models"));
        FileIO.writeToFile(neuralNet, MODEL_PATH);

        // 10. Use trained model for prediction
        MLDataItem sonarExample = testSet.get(0);
        float[] sonarSignal = sonarExample.getInput().getValues();
        float actualTarget = sonarExample.getTargetOutput().getValues()[0];

        float mineProbability = neuralNet.predict(sonarSignal)[0];

        System.out.printf("Mine probability: %.4f%n", mineProbability);
        System.out.println("Predicted: "
                + (mineProbability >= 0.5f ? "MINE" : "ROCK"));
        System.out.println("Actual: "
                + (actualTarget >= 0.5f ? "MINE" : "ROCK"));
    }


    private static void verifyJavaRuntime() {
        if (Runtime.version().feature() != 25) {
            throw new IllegalStateException("Java 25 is required. Maven is using Java "
                    + Runtime.version().feature() + ".");
        }
        if (ModuleLayer.boot().findModule("jdk.incubator.vector").isEmpty()) {
            throw new IllegalStateException(
                    "Vector API is not enabled. Run Maven with --add-modules jdk.incubator.vector.");
        }
    }
}
