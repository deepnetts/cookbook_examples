package com.deepnetts.examples.multiplelinearregression;

import deepnetts.core.DeepNetts;
import deepnetts.data.DataSets;
import deepnetts.data.MLDataItem;
import deepnetts.data.TabularDataSet;
import deepnetts.data.TrainTestSplit;
import deepnetts.data.norm.Standardizer;
import deepnetts.eval.RegressionMetrics;
import deepnetts.net.FeedForwardNetwork;
import deepnetts.net.layers.activation.ActivationType;
import deepnetts.net.loss.LossType;
import deepnetts.net.train.opt.OptimizerType;

import javax.visrec.ml.data.DataSet;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;

/**
 * Problem: Computer performance prediction 
 * 
 * Predicts computer performance from hardware characteristics using
 * multiple linear regression.
 *
 * Dataset: 6 numerical input features and 1 continuous target (PRP).
 */
public class MultipleLinearRegressionDeepNetts {

    // 0. Configuration
    private static final String DATASET_PATH =
            "src/main/resources/datasets/computer_hardware.csv";

    private static final String MODEL_PATH =
            "models/computer-hardware-multiple-regression.dnet";

    private static final int NUM_INPUTS = 6;
    private static final int NUM_OUTPUTS = 1;

    public static void main(String[] args) throws Exception {
        // 1. Runtime configuration
        verifyJavaRuntime();
        DeepNetts.getInstance().setUseCuda(false);

        // 2. Load data
        TabularDataSet<MLDataItem> dataSet =
                DataSets.readCsv(
                        DATASET_PATH,
                        NUM_INPUTS,
                        NUM_OUTPUTS,
                        true,
                        ","
                );

        // 3. Inspect data
        System.out.println("Samples: " + dataSet.size());
        System.out.println(
                "Columns: " + Arrays.toString(dataSet.getColumnNames())
        );

        // 4. Shuffle and split
        dataSet.shuffle(42);

        TrainTestSplit split = dataSet.trainTestSplit(0.8);

        DataSet<MLDataItem> trainingSet = split.getTrainingSet();
        DataSet<MLDataItem> testSet = split.getTestSet();

        // 5. Preprocess
        Standardizer standardizer = new Standardizer(trainingSet);

        standardizer.apply(trainingSet);
        standardizer.apply(testSet);

        // 6. Build linear model
        FeedForwardNetwork neuralNet =
                FeedForwardNetwork.builder()
                        .addInputLayer(NUM_INPUTS)
                        .addOutputLayer(NUM_OUTPUTS, ActivationType.LINEAR)
                        .lossFunction(LossType.MEAN_SQUARED_ERROR)
                        .randomSeed(42)
                        .build();

        // 7. Configure and train
        neuralNet.getTrainer()
                .setStopEpochs(3000)
                .setLearningRate(0.001f)
                .setOptimizer(OptimizerType.SGD)
                .setShuffle(true);

        neuralNet.train(trainingSet);

        // 8. Evaluate
        RegressionMetrics metrics = (RegressionMetrics) neuralNet.test(testSet);
        System.out.println(metrics);

        // 9. Save model with preprocessing
        neuralNet.setNormalizer(standardizer);

        Files.createDirectories(Path.of("models"));
        neuralNet.save(MODEL_PATH);

        // 10. Predict computer performance
        float[] computer = {
                26,       // MYCT
                16000,    // MMIN
                32000,    // MMAX
                64,       // CACH
                16,       // CHMIN
                24        // CHMAX
        };
        float predictedPerformance = neuralNet.predict(computer)[0];
        System.out.printf("Predicted relative performance: %.2f%n", predictedPerformance);
    }

    private static void verifyJavaRuntime() {
        if (Runtime.version().feature() < 25) {
            throw new IllegalStateException("Java 25 or newer is required. Maven is using Java "
                    + Runtime.version().feature() + ".");
        }
    }
}
