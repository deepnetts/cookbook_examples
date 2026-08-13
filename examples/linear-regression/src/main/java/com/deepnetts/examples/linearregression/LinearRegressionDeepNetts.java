package com.deepnetts.examples.linearregression;

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
 * Predicts sorting execution time from the number of comparisons.
 *
 * This is simple linear regression because the model has exactly one input
 * feature and one continuous target.
 */
public class LinearRegressionDeepNetts {

    // 0. Configuration
    private static final String DATASET_PATH = "src/main/resources/datasets/sorting_algorithm_regression.csv";

    private static final String MODEL_PATH = "models/sorting-execution-time-regression.dnet";

    private static final int NUM_INPUTS = 1;
    private static final int NUM_OUTPUTS = 1;

    public static void main(String[] args) throws Exception {

        // 1. Runtime configuration
        DeepNetts.getInstance().setUseCuda(false);

        // 2. Load data
        TabularDataSet<MLDataItem> dataSet =
                DataSets.readCsv(DATASET_PATH,NUM_INPUTS,NUM_OUTPUTS,true,",");

        // 3. Inspect data
        System.out.println("Samples: " + dataSet.size());
        System.out.println("Columns: " + Arrays.toString(dataSet.getColumnNames()));

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
                        .addOutputLayer(NUM_OUTPUTS,ActivationType.LINEAR)
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

        // 10. Predict sorting execution time
        float comparisonCount = 100_000;
        float predictedExecutionTime = neuralNet.predict(comparisonCount)[0];

        System.out.printf("Predicted execution time for %.0f comparisons: %.2f ms%n",
                comparisonCount,predictedExecutionTime);
    }
}
