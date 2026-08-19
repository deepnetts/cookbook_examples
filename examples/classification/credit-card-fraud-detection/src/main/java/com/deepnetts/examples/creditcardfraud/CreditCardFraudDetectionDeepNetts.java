package com.deepnetts.examples.creditcardfraud;

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
import javax.visrec.ml.data.DataSet;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;

/** Detects fraudulent credit-card transactions from anonymized features. */
public class CreditCardFraudDetectionDeepNetts {
    private static final String DATASET_PATH = "src/main/resources/datasets/creditcard-balanced.csv";
    private static final String MODEL_PATH = "models/credit-card-fraud-detector.dnet";
    private static final int NUM_INPUTS = 29;
    private static final int NUM_OUTPUTS = 1;

    public static void main(String[] args) throws Exception {
        verifyJavaRuntime();

        // 1. Runtime configuration
        DeepNetts.getInstance().setUseCuda(false);
        DeepNetts.getInstance().setMaxThreads(1);

        // 2. Load and inspect data
        TabularDataSet<MLDataItem> dataSet = DataSets.readCsv(
                DATASET_PATH, NUM_INPUTS, NUM_OUTPUTS, true, ",");
        System.out.println("Samples: " + dataSet.size());
        System.out.println("Columns: " + Arrays.toString(dataSet.getColumnNames()));
        float[] exampleTransaction = dataSet.get(0).getInput().getValues().clone();

        // 3. Shuffle and split
        dataSet.shuffle(42);
        TrainTestSplit split = dataSet.trainTestSplit(0.8);
        DataSet<MLDataItem> trainingSet = split.getTrainingSet();
        DataSet<MLDataItem> testSet = split.getTestSet();

        // 4. Fit preprocessing only on training data
        MinMaxScaler scaler = DataSets.scaleToMinMax(trainingSet);
        scaler.apply(testSet);

        // 5. Build model
        FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
                .addInputLayer(NUM_INPUTS)
                .addFullyConnectedLayer(32)
                .addFullyConnectedLayer(16)
                .addOutputLayer(NUM_OUTPUTS, ActivationType.SIGMOID)
                .lossFunction(LossType.CROSS_ENTROPY)
                .randomSeed(42)
                .build();

        // 6. Configure and train
        neuralNet.getTrainer()
                .setStopEpochs(100)
                .setLearningRate(0.001f)
                .setOptimizer(OptimizerType.SGD)
                .setBatchMode(true)
                .setBatchSize(32)
                .setShuffle(true);
        neuralNet.train(trainingSet);

        // 7. Evaluate
        ClassificationMetrics metrics = (ClassificationMetrics) neuralNet.test(testSet);
        System.out.println(metrics);

        // 8. Save model with preprocessing
        neuralNet.setNormalizer(scaler);
        Files.createDirectories(Path.of("models"));
        neuralNet.save(MODEL_PATH);

        // 9. Predict one held-out transaction
        float fraudProbability = neuralNet.predict(exampleTransaction)[0];
        System.out.printf("Fraud probability: %.4f%n", fraudProbability);
        System.out.println(fraudProbability >= 0.5f ? "FRAUD" : "LEGITIMATE");
    }

    private static void verifyJavaRuntime() {
        if (Runtime.version().feature() != 25) {
            throw new IllegalStateException("Java 25 is required. Maven is using Java " + Runtime.version().feature() + ".");
        }
        if (ModuleLayer.boot().findModule("jdk.incubator.vector").isEmpty()) {
            throw new IllegalStateException("Vector API is not enabled. Run Maven with --add-modules jdk.incubator.vector.");
        }
    }
}
