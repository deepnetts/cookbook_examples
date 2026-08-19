package com.deepnetts.examples.multiclassclassification;

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
 * Problem: Iris flower species classification.
 *
 * Dataset: 4 numerical input features and 3 one-hot encoded target columns.
 *
 * Trains and evaluates a neural network that classifies an Iris flower as
 * setosa, versicolor, or virginica.
 */
public class MulticlassClassificationDeepNetts {

    // 0. Configuration
    private static final String DATASET_PATH =
            "src/main/resources/datasets/iris-flowers.csv";

    private static final String MODEL_PATH =
            "models/iris-multiclass-classifier.dnet";

    private static final int NUM_INPUTS = 4;
    private static final int NUM_OUTPUTS = 3;

    private static final String[] CLASS_NAMES = {
        "SETOSA", "VERSICOLOR", "VIRGINICA"
    };

    public static void main(String[] args) throws Exception {
        verifyJavaRuntime();

        // 1. Runtime configuration
        DeepNetts.getInstance().setUseCuda(false);
        DeepNetts.getInstance().setMaxThreads(1);

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
                .addFullyConnectedLayer(16, ActivationType.TANH)
                .addOutputLayer(NUM_OUTPUTS, ActivationType.SOFTMAX)
                .lossFunction(LossType.CROSS_ENTROPY)
                .randomSeed(42)
                .build();

        // 7. Configure and train
        neuralNet.getTrainer()
                .setStopError(0.03f)
                .setStopEpochs(350)
                .setLearningRate(0.001f)
                .setOptimizer(OptimizerType.ADAM);

        neuralNet.train(trainingSet);

        // 8. Evaluate
        ClassificationMetrics metrics =
                (ClassificationMetrics) neuralNet.test(testSet);

        System.out.println(metrics);

        // 9. Save model with preprocessing
        neuralNet.setNormalizer(scaler);

        Files.createDirectories(Path.of("models"));
        neuralNet.save(MODEL_PATH);

        // 10. Use trained model
        float[] flower = {
            5.1f, // sepal length
            3.5f, // sepal width
            1.4f, // petal length
            0.2f  // petal width
        };

        float[] probabilities = neuralNet.predict(flower);
        int predictedClass = indexOfLargest(probabilities);

        System.out.println("Class probabilities: " + Arrays.toString(probabilities));
        System.out.println("Predicted species: " + CLASS_NAMES[predictedClass]);
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

    private static int indexOfLargest(float[] values) {
        int largestIndex = 0;

        for (int i = 1; i < values.length; i++) {
            if (values[i] > values[largestIndex]) {
                largestIndex = i;
            }
        }

        return largestIndex;
    }
}
