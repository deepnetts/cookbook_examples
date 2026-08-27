# Developer guides

Developer guides are focused deep-dives into specific Deep Netts development tasks, such as preparing data, configuring training, evaluating a model, or saving it for later use. They are one of the fastest ways to understand how an individual API operation fits into a real Java Machine Learning workflow.

Each guide contains a compact Java recipe, explains the important choices, and links to complete runnable examples. The examples use standalone Maven projects, so you can copy the relevant snippet into your own workflow or open the full project when you need more context.

<div class="developer-guides-list">
  <a href="loading-data/">
    <strong>Loading data</strong>
    <span>Read prepared tabular datasets and define their input and target columns.</span>
  </a>
  <a href="preparing-data/">
    <strong>Preparing data</strong>
    <span>Shuffle, split, standardize, and scale data without leaking test information.</span>
  </a>
  <a href="creating-model/">
    <strong>Creating a model</strong>
    <span>Match network inputs, outputs, activations, and loss to the prediction task.</span>
  </a>
  <a href="training-model/">
    <strong>Training a model</strong>
    <span>Configure epochs, learning rate, optimizer, shuffling, and mini-batches.</span>
  </a>
  <a href="evaluating-model/">
    <strong>Evaluating a model</strong>
    <span>Measure regression or classification performance on held-out samples.</span>
  </a>
  <a href="saving-loading/">
    <strong>Saving and loading</strong>
    <span>Preserve a trained network and the preprocessing required for prediction.</span>
  </a>
  <a href="making-predictions/">
    <strong>Making predictions</strong>
    <span>Prepare new input and convert model output into a useful result.</span>
  </a>
  <a href="jsr381/">
    <strong>JSR 381 and Deep Netts</strong>
    <span>Understand the standard VisRec interfaces and how Deep Netts supplies concrete Machine Learning functionality.</span>
  </a>
</div>

For the wider conceptual context, continue with <a href="../lectures/03-deep-netts-api/" target="_blank" rel="noopener noreferrer"><strong>Deep Netts API</strong></a> and <a href="../lectures/04-model-development/" target="_blank" rel="noopener noreferrer"><strong>Model Development</strong></a>. To see every step assembled into one application, choose a project from <a href="../examples/" target="_blank" rel="noopener noreferrer"><strong>Examples</strong></a>.
