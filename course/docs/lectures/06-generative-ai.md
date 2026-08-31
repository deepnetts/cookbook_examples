# Generative AI

The cookbook examples predict numbers and classify existing inputs. Generative AI uses the same learning foundations to create new text, images, audio, code, or other data.

!!! info "Scope of this lesson"
    Deep Netts demonstrates the neural-network foundations and a small sequence-prediction concept here. This cookbook does not contain a runnable Transformer or Large Language Model project. External LLM services are not built-in Deep Netts features, and their snippets below are architectural illustrations.

## From analysis to generation

<figure class="course-figure">
  <img src="../../assets/course-figures/analysis-vs-generation.svg" alt="Traditional Machine Learning mapping features to a class or number compared with Generative AI mapping context or noise to new content">
  <figcaption>Traditional models analyze an input to predict a result; generative models produce a new sample conditioned on context, noise, or both.</figcaption>
</figure>

Text generation is commonly next-token prediction. Given tokens $x_1,\ldots,x_t$, the model estimates:

$$
P(x_{t+1}\mid x_1,x_2,\ldots,x_t)
$$

```text
Input:  "The cat sat on the"
Model:  P("mat") = 0.35, P("floor") = 0.25, P("chair") = 0.20, ...
Sample: "mat"
```

The chosen token is appended to the context and prediction repeats until a sequence is complete.

## Shared building blocks

| Course concept | Generative role |
|---|---|
| Inputs | Tokens, pixels, audio samples, latent values, or conditioning data |
| Weights and biases | Parameters that encode learned patterns |
| Activations | Nonlinear transformations inside model blocks |
| Softmax | Probability distribution over possible next tokens |
| Cross-entropy | Common next-token loss |
| Backpropagation | Calculates gradients through the complete model |
| Optimizer | Updates parameters from gradients |

Generative systems operate at much larger architecture, data, compute, and parameter scales than the examples in this course, but the forward-pass, loss, backpropagation, and optimization loop remains recognizable.

## Types of generative models

| Family | Typical output | Main idea |
|---|---|---|
| Large Language Models | Text and code | Predict or sample tokens from context |
| Diffusion models | Images, audio, and video | Reverse a gradual noising process |
| Generative Adversarial Networks | Images and synthetic data | Generator competes with discriminator |
| Variational Autoencoders | Images and latent representations | Learn a structured latent probability space |

Each family needs an architecture and objective suited to its data and generation process.

## Transformers

Transformers are the dominant architecture for current text generation. Attention lets every token weigh relevant information from other positions rather than relying only on a fixed sequential state.

```text
"The cat, which was very old and tired, sat on the ___"
       ^                                        ^
       +----------- relevant context -----------+
```

A Transformer combines attention, learned projections, feed-forward layers, residual connections, normalization, and positional information.

## Self-attention

Every token representation produces:

- **Query ($Q$):** what this position seeks;
- **Key ($K$):** what this position can match;
- **Value ($V$):** the information this position contributes.

Scaled dot-product attention is:

$$
\operatorname{Attention}(Q,K,V)
=\operatorname{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

1. $QK^T$ measures query-key compatibility.
2. Division by $\sqrt{d_k}$ keeps scores numerically stable.
3. Softmax produces attention weights.
4. Multiplication by $V$ combines information using those weights.

Without scaling, dot products tend to grow with vector width, pushing Softmax toward regions with tiny gradients.

## Multi-head attention

Several attention operations run in parallel:

$$
\operatorname{MultiHead}(Q,K,V)
=\operatorname{Concat}(head_1,\ldots,head_h)W^O
$$

$$
head_i=\operatorname{Attention}(QW_i^Q,KW_i^K,VW_i^V)
$$

Different heads can learn local syntax, long-range references, or other relationships. Their outputs are combined into one representation.

## Transformer block

<figure class="course-figure">
  <img src="../../assets/course-figures/transformer-block.svg" alt="Transformer block showing query, key, and value inputs, multi-head attention, residual normalization, and a feed-forward network">
  <figcaption>Attention mixes information across token positions; residual paths, normalization, and a feed-forward network turn it into the next contextual representation.</figcaption>
</figure>

The feed-forward component uses the same weighted sums, nonlinear activations, and backpropagation principles as the Deep Netts models in this course. Attention adds sequence-aware context that the simple cookbook networks do not implement.

## Training language models

### Pre-training

An autoregressive model predicts every next token:

$$
L=-\sum_{t=1}^{T}\log P(x_t\mid x_1,x_2,\ldots,x_{t-1})
$$

This is cross-entropy applied across a large vocabulary. Backpropagation sends gradients through every Transformer block.

### Fine-tuning and alignment

After pre-training, models can be adapted with supervised fine-tuning, preference data, reinforcement-learning methods, or other alignment techniques. Pipelines differ by model and provider, but they build on the pre-trained token predictor.

## Temperature and sampling

Temperature $T$ rescales token logits $z_i$ before Softmax:

$$
P(x_i)=\frac{e^{z_i/T}}{\sum_j e^{z_j/T}}
$$

| Temperature | Typical effect |
|---|---|
| Low positive value | Sharper distribution and repeatable choices |
| $T=1$ | Original learned distribution |
| Higher value | Flatter distribution and more variation |

Production APIs may also offer top-$k$, top-$p$, repetition penalties, stop sequences, and provider-specific deterministic decoding.

## Sequence prediction with Deep Netts

A small feed-forward network can illustrate sliding-window prediction. It is not a Transformer, LLM, or general text generator.

```csv
x1,x2,x3,next
1,1,2,3
1,2,3,5
2,3,5,8
3,5,8,13
5,8,13,21
```

Load and preprocess using the current Deep Netts 4 pattern:

```java
TabularDataSet<MLDataItem> dataSet = DataSets.readCsv(
        "sequence.csv", 3, 1, true, ",");

dataSet.shuffle(42);
TrainTestSplit split = dataSet.trainTestSplit(0.8);
DataSet<MLDataItem> trainingSet = split.getTrainingSet();
DataSet<MLDataItem> testSet = split.getTestSet();

Standardizer standardizer = new Standardizer(trainingSet);
standardizer.apply(trainingSet);
standardizer.apply(testSet);
```

Build a nonlinear regression model:

```java
FeedForwardNetwork neuralNet = FeedForwardNetwork.builder()
        .addInputLayer(3)
        .addFullyConnectedLayer(8, ActivationType.RELU)
        .addFullyConnectedLayer(4, ActivationType.RELU)
        .addOutputLayer(1, ActivationType.LINEAR)
        .lossFunction(LossType.MEAN_SQUARED_ERROR)
        .randomSeed(42)
        .build();

neuralNet.getTrainer()
        .setStopEpochs(5000)
        .setLearningRate(0.001f)
        .setOptimizer(OptimizerType.SGD)
        .setShuffle(true);

neuralNet.train(trainingSet);
RegressionMetrics metrics = (RegressionMetrics) neuralNet.test(testSet);

neuralNet.setNormalizer(standardizer);
float[] sequenceWindow = {5f, 8f, 13f};
float nextValue = neuralNet.predict(sequenceWindow)[0];
```

This demonstrates how previous values become features. Serious sequence modeling also requires representative data, careful evaluation, and a sequence-aware architecture.

## Use an external LLM from Java

Real applications often call a pretrained model through a provider API. Endpoint paths, headers, request schemas, model identifiers, pricing, and controls are provider-specific and can change.

```java
String endpoint = System.getenv("LLM_API_URL");
String apiKey = System.getenv("LLM_API_KEY");

String requestBody = """
        {
          "model": "MODEL_ID",
          "messages": [{
            "role": "user",
            "content": "Explain neural networks for a Java developer."
          }]
        }
        """;

HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(endpoint))
        .header("Authorization", "Bearer " + apiKey)
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(requestBody))
        .build();

HttpResponse<String> response = HttpClient.newHttpClient().send(
        request, HttpResponse.BodyHandlers.ofString());
```

Production code must handle secrets, JSON serialization, timeouts, retries, unsuccessful status codes, rate limits, privacy, observability, and response validation. Never commit API keys.

## Hybrid Deep Netts and Generative AI

Deep Netts can produce a structured prediction, while an external LLM turns approved facts into natural language:

```text
features -> Deep Netts -> prediction and metrics
                              |
                              v
                     approved prompt context
                              |
                              v
                       external LLM -> explanation
```

```java
float[] irisFeatures = {5.1f, 3.5f, 1.4f, 0.2f};
float[] probabilities = classifier.predict(irisFeatures);
int predictedClass = argMax(probabilities);
float confidence = probabilities[predictedClass];

String prompt = String.format(
        "The classifier predicted class %d with %.1f%% confidence. "
        + "Explain the result using only these supplied facts.",
        predictedClass, confidence * 100);

// Send the prompt through an explicitly configured external LLM client.
```

Generated explanations do not replace model metrics or domain validation. Send only policy-approved data and review output before consequential use.

## Connect the course

```text
Machine Learning Basics         -> data, targets, and evaluation
Linear Regression               -> the smallest trainable neuron
Logistic Regression             -> binary probabilities and decision boundaries
Neural Networks                 -> hidden layers and representations
Backpropagation                 -> gradients and parameter updates
Convolutional Neural Networks   -> spatial features and image classification
Deep Netts API                  -> Java model-development components
Model Development               -> reproducible end-to-end workflow
Natural Language Processing     -> tokens, representations, and language tasks
Generative AI                   -> sequence generation and attention at scale
```

Generative AI builds on probability distributions, differentiable layers, losses, backpropagation, optimization, and evaluation, then adds architectures designed for generation.

## Where to go next

- Transformer architectures and positional representations;
- recurrent networks and sequence modeling;
- diffusion and convolutional models;
- retrieval-augmented generation;
- generative-model evaluation and fine-tuning;
- reinforcement learning and preference optimization;
- privacy, security, safety, and responsible deployment.

Use the [Examples gallery](../examples/index.md) for verified Deep Netts workflows available in this repository before exploring specialized generative frameworks or hosted models.
