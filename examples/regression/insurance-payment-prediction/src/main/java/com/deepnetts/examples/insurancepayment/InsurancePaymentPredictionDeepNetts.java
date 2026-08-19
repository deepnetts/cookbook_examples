package com.deepnetts.examples.insurancepayment;

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

/** Predicts total insurance payments from the number of claims. */
public class InsurancePaymentPredictionDeepNetts {
    private static final String DATASET_PATH = "src/main/resources/datasets/swedish_auto_insurance.csv";
    private static final String MODEL_PATH = "models/insurance-payment-regression.dnet";
    private static final int NUM_INPUTS = 1;
    private static final int NUM_OUTPUTS = 1;

    public static void main(String[] args) throws Exception {
        verifyJavaRuntime();
        DeepNetts.getInstance().setUseCuda(false);
        DeepNetts.getInstance().setMaxThreads(1);

        // 1. Load data
        TabularDataSet<MLDataItem> dataSet = DataSets.readCsv(
                DATASET_PATH, NUM_INPUTS, NUM_OUTPUTS, false, ",");
        System.out.println("Samples: " + dataSet.size());

        // 2. Shuffle and split
        dataSet.shuffle(42);
        TrainTestSplit split = dataSet.trainTestSplit(0.8);
        DataSet<MLDataItem> trainingSet = split.getTrainingSet();
        DataSet<MLDataItem> testSet = split.getTestSet();

        // 3. Standardize using training statistics
        Standardizer standardizer = new Standardizer(trainingSet);
        standardizer.apply(trainingSet);
        standardizer.apply(testSet);

        // 4. Build a one-input linear model
        FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
                .addInputLayer(NUM_INPUTS)
                .addOutputLayer(NUM_OUTPUTS, ActivationType.LINEAR)
                .lossFunction(LossType.MEAN_SQUARED_ERROR)
                .randomSeed(42)
                .build();

        // 5. Configure and train
        neuralNet.getTrainer()
                .setStopEpochs(1500)
                .setLearningRate(0.001f)
                .setOptimizer(OptimizerType.SGD)
                .setShuffle(true);
        neuralNet.train(trainingSet);

        // 6. Evaluate
        RegressionMetrics metrics = (RegressionMetrics) neuralNet.test(testSet);
        System.out.println(metrics);

        // 7. Save model with preprocessing
        neuralNet.setNormalizer(standardizer);
        Files.createDirectories(Path.of("models"));
        neuralNet.save(MODEL_PATH);

        // 8. Predict normalized payment for a normalized claim count
        float normalizedClaimCount = 0.25f;
        float predictedPayment = neuralNet.predict(normalizedClaimCount)[0];
        System.out.printf("Predicted normalized payment: %.4f%n", predictedPayment);
    }

    private static void verifyJavaRuntime() {
        if (Runtime.version().feature() != 25) throw new IllegalStateException("Java 25 is required.");
        if (ModuleLayer.boot().findModule("jdk.incubator.vector").isEmpty()) throw new IllegalStateException("Vector API is not enabled. Run Maven with --add-modules jdk.incubator.vector.");
    }
}
