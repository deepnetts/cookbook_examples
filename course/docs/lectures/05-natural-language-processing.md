# Natural Language Processing

Natural Language Processing (NLP) applies Machine Learning to text and language. It turns documents, sentences, or token sequences into numerical representations that a model can use for classification, scoring, extraction, similarity, or generation.

NLP is not a separate replacement for the workflow developed earlier in the course. It adds a language-specific preparation stage before the familiar sequence:

<figure class="course-figure">
  <img src="../../assets/course-figures/nlp-model-contract.svg" alt="Numerical features entering a learned model and producing a task-specific prediction">
  <figcaption>NLP keeps the same model contract; it adds the language-specific steps that create the numerical features.</figcaption>
</figure>

!!! info "Current cookbook scope"
    The current cookbook does not contain a runnable Deep Netts raw-text, recurrent-network, or Transformer project. The Email Spam example uses already prepared numerical features rather than tokenizing email bodies. Code in this lesson that prepares text is illustrative Java preprocessing, not a built-in Deep Netts tokenizer API.

## From language to model input

A model cannot consume the meaning of raw text directly. The application first decides which parts of the text matter and how to represent them numerically.

<figure class="course-figure">
  <img src="../../assets/course-figures/nlp-processing-pipeline.svg" alt="Raw text normalized and tokenized, converted into numerical representations, processed by a model, and converted into task output">
  <figcaption>NLP adds text preparation and representation before the same model-development workflow used for tabular and image data.</figcaption>
</figure>

Every stage defines part of the model contract:

- **Raw text** — The original language input includes words, case, punctuation, accents, formatting, and document structure that may carry useful information.
- **Normalize and tokenize** — Normalization decides which details are preserved or transformed, while tokenization defines the basic units, such as words, subwords, characters, punctuation, or special markers.
- **Numerical representation** — A vocabulary maps known tokens to stable identifiers or feature positions, and the selected representation converts them into vectors or numerical sequences.
- **Model** — The model learns transformations from the prepared numerical input rather than operating on raw language directly.
- **Output** — The final representation is converted into the result required by the task, such as a class, score, token label, ranked match, or generated text.

Changing any of these decisions after training changes what the model receives.

## Tokens and vocabulary

A **token** is one unit processed by the language pipeline. Depending on the tokenizer, a token may be a word, part of a word, punctuation mark, character, or special marker.

For a small educational word tokenizer, plain Java might normalize and split text like this:

```java
String normalized = text
        .toLowerCase(Locale.ROOT)
        .replaceAll("[^\\p{L}\\p{N}']+", " ")
        .trim();

List<String> tokens = normalized.isEmpty()
        ? List.of()
        : List.of(normalized.split("\\s+"));
```

This snippet is intentionally simple. Production tokenization must define behavior for languages, Unicode, contractions, URLs, numbers, emoji, markup, and unknown tokens.

A **vocabulary** gives each known token a stable index:

<figure class="course-figure">
  <img src="../../assets/course-figures/nlp-vocabulary-mapping.svg" alt="Vocabulary table mapping indices zero through four to UNKNOWN, java, neural, network, and training tokens">
  <figcaption>The token-to-index mapping is part of the trained input contract; unseen tokens use the reserved fallback index.</figcaption>
</figure>

Unknown or rare tokens are commonly mapped to a reserved value instead of silently changing the input shape.

!!! warning "Fit text preprocessing on training data only"
    Build the vocabulary and calculate corpus-derived statistics only from the training documents. Reusing information from test documents during vocabulary selection or TF-IDF fitting is data leakage.

## Numerical text representations

The representation determines what the model can learn from the text.

<figure class="course-figure">
  <img src="../../assets/course-figures/text-representation-options.svg" alt="Comparison of Bag of Words, TF-IDF, and learned embedding representations">
  <figcaption>Count-based vectors are simple and useful for baselines; embeddings provide dense learned representations that can preserve similarity and context.</figcaption>
</figure>

### Bag of Words

Bag of Words creates one feature per vocabulary term and stores a count or presence value. It is simple and interpretable, but it discards token order.

For vocabulary $V$ and document $d$:

$$
x_j=\operatorname{count}(V_j,d)
$$

### TF-IDF

Term Frequency–Inverse Document Frequency reduces the influence of terms that occur in many documents and emphasizes terms that are more distinctive:

$$
\operatorname{tfidf}(t,d)=\operatorname{tf}(t,d)\log\left(\frac{N}{\operatorname{df}(t)}\right)
$$

$N$ is the number of training documents and $\operatorname{df}(t)$ counts training documents containing token $t$.

### Embeddings

An embedding maps a token, sentence, or document to a dense numerical vector. Similar language units can occupy nearby regions of the learned vector space.

Embeddings may be:

- learned together with a task-specific model;
- produced by a separately trained model;
- supplied by an external embedding service.

**Word2Vec** is a classic method for learning word embeddings from nearby-word patterns in a text corpus. Words used in similar contexts receive nearby vectors. Word2Vec produces a static embedding, so a word has the same vector wherever it appears. Contextual embedding models can instead produce different vectors for the same word according to its surrounding sentence.

An external embedding model or service is not an integrated Deep Netts feature unless the application connects and validates it explicitly.

## Common NLP tasks

| Task | Input | Typical output |
|---|---|---|
| Text classification | Document or sentence | Topic, sentiment, spam, intent, or another class |
| Sequence labeling | Token sequence | One label per token, such as an entity tag |
| Similarity or retrieval | Two texts or a query and documents | Similarity score or ranked results |
| Information extraction | Document | Structured fields or relationships |
| Language modeling | Previous tokens | Probability distribution for the next token |
| Text generation | Prompt or context | Newly generated token sequence |

The first four tasks analyze existing text. Language modeling and generation predict or create new sequences and lead directly into Generative AI.

## Text classification with Deep Netts

Once text has become a fixed numerical feature vector, a Deep Netts classifier can use the same API pattern as other tabular examples.

For a binary document classifier with `NUM_TEXT_FEATURES` prepared inputs:

```java
FeedForwardNetwork classifier = FeedForwardNetwork.builder()
        .addInputLayer(NUM_TEXT_FEATURES)
        .addFullyConnectedLayer(32, ActivationType.RELU)
        .addOutputLayer(1, ActivationType.SIGMOID)
        .lossFunction(LossType.CROSS_ENTROPY)
        .randomSeed(42)
        .build();
```

The model sees only numbers. The application must preserve:

- the exact vocabulary and token-to-index mapping;
- the same normalization and tokenizer rules;
- the same vectorization and scaling behavior;
- the feature order used during training;
- the class mapping and decision threshold.

The runnable [Email Spam Detection walkthrough](../examples/classification/email-spam-detection.md) demonstrates the classification, training, metrics, saving, and prediction stages. Its five inputs are prepared email and sender characteristics, so it is a useful classifier reference but not a raw-text NLP pipeline.

## Sequence order and context

Bag-of-Words and TF-IDF summarize a document into one fixed vector. Some tasks instead require token order and long-range context.

<figure class="course-figure">
  <img src="../../assets/course-figures/nlp-sequence-context.svg" alt="Comparison of fixed document vectors, recurrent sequence processing, and Transformer attention">
  <figcaption>Fixed vectors summarize text, recurrent models carry state through token order, and Transformer attention connects relevant token positions directly.</figcaption>
</figure>

### Fixed-vector models

A feed-forward classifier can work well when a fixed representation already captures enough evidence. It is often a strong baseline for topic, spam, intent, or sentiment classification.

### Recurrent models

Recurrent Neural Networks process a sequence step by step and carry a hidden state forward. LSTM and GRU variants add gates that help retain useful information across longer ranges.

### Transformers

Transformers use self-attention so each token representation can combine information from relevant positions. Positional information preserves order, while multi-head attention learns several relationships in parallel.

These sequence-aware architectures are explained conceptually here. The current cookbook does not present them as runnable built-in Deep Netts examples.

## Developing a trustworthy NLP model

Text pipelines introduce additional leakage and evaluation risks.

### Split documents before fitting

Create training, validation, and test document groups before:

- selecting vocabulary terms;
- calculating document frequencies for TF-IDF;
- learning task-specific embeddings;
- selecting thresholds or hyperparameters.

Near-duplicate documents, quoted text, message threads, or documents from the same author can leak information across random splits. Group-based or time-based splits may better represent production behavior.

### Evaluate the task, not only the loss

For classification, inspect accuracy, precision, recall, F1, specificity, and the confusion matrix. For retrieval, use ranking metrics. For generated text, automated metrics alone are rarely sufficient; quality, grounding, safety, and human review may also matter.

### Preserve the complete text contract

Saving only the neural network is insufficient. A deployable NLP system must also preserve tokenizer configuration, vocabulary, representation settings, class names, thresholds, and any external model or service version.

## Practical checklist

- Define the language task and target before selecting an architecture.
- Decide what one sample represents: message, sentence, document, or token sequence.
- Split documents before fitting vocabulary or corpus statistics.
- Normalize and tokenize training and future text identically.
- Start with an interpretable fixed-vector baseline when appropriate.
- Use a sequence-aware model only when order and context materially matter.
- Evaluate class-specific errors and dataset leakage.
- Version every preprocessing and external-model dependency with the trained model.
- Do not represent an external embedding or LLM service as built-in Deep Netts functionality.

## Continue learning

Continue with [Generative AI](06-generative-ai.md) *(optional)* to see how next-token prediction, Transformer attention, sampling, and external LLM integration extend these NLP foundations into text generation.
