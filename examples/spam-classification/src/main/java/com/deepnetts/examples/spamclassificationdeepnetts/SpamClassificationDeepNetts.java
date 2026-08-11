package com.deepnetts.examples.spamclassificationdeepnetts;

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

/*
 * Problem: Email spam detection.
 *
 * Dataset: 5 numerical input features and 1 binary target (is_spam).
 *
 * Trains and evaluates a neural network that classifies email messages
 * as spam or not spam.
 
 */

public class SpamClassificationDeepNetts {
    
        //0. Configuration
    private static final String DATASET_PATH = "src/main/resources/datasets/spam_detection_dataset.csv";

    private static final String MODEL_PATH = "models/spam-classifier.dnet";

    private static final int NUM_INPUTS = 5;
    private static final int NUM_OUTPUTS = 1;

    public static void main(String[] args) throws Exception {

        // 1. Runtime configuration
        DeepNetts.getInstance().setUseCuda(false);

        // 2. Load data
        TabularDataSet<MLDataItem> dataSet =
                DataSets.readCsv(
                        DATASET_PATH,
                        NUM_INPUTS,
                        NUM_OUTPUTS,
                        true, // header
                        "," // delimeter
                );

        // 3. Inspect data
        System.out.println("Samples: " + dataSet.size());
        System.out.println("Columns: " + Arrays.toString(dataSet.getColumnNames()));

        // 4. Shuffle and split
        dataSet.shuffle(42);

        TrainTestSplit split = dataSet.trainTestSplit(0.8);

        DataSet<MLDataItem> trainingSet = split.getTrainingSet();

        DataSet<MLDataItem> testSet = split.getTestSet();

        // 5. Preprocess
        MinMaxScaler scaler = DataSets.scaleToMinMax(trainingSet);

        scaler.apply(testSet);

        // 6. Build model
        FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
                        .addInputLayer(NUM_INPUTS)
                        .addFullyConnectedLayer(32) // ActivationType.RELU is by default 
                        .addFullyConnectedLayer(16)
                        .addOutputLayer(NUM_OUTPUTS,ActivationType.SIGMOID)
                        .lossFunction(LossType.CROSS_ENTROPY)
                        .randomSeed(42)
                        .build();

        // 7. Configure and train
        neuralNet.getTrainer()
                .setStopEpochs(50)
                .setLearningRate(0.001f)
                .setOptimizer(OptimizerType.SGD)
                .setBatchMode(true)
                .setBatchSize(64)
                .setShuffle(true);

        neuralNet.train(trainingSet);

        // 8. Evaluate
        ClassificationMetrics metrics = (ClassificationMetrics) neuralNet.test(testSet);

        System.out.println(metrics);

        // 9. Save model with preprocessing
        neuralNet.setNormalizer(scaler);

        Files.createDirectories(Path.of("models"));
        neuralNet.save(MODEL_PATH);

        // 10. Use trained model
        float[] email = {
            4,     // num_links
            55,    // num_words
            1,     // has_offer
            0.35f, // sender_score
            1      // all_caps
        };

        float spamProbability = neuralNet.predict(email)[0];

        System.out.printf("Spam probability: %.4f%n",spamProbability);
        System.out.println(spamProbability >= 0.5f ? "SPAM" : "NOT SPAM");

        
    }
}