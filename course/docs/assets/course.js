document.addEventListener("DOMContentLoaded", function () {
    const navigation = document.getElementById("side");
    const navigationHeading = navigation
        ? navigation.querySelector("h2")
        : null;
    const toc = document.getElementById("toc");

    if (navigationHeading) {
        navigationHeading.textContent = "Course navigation";
    }

    if (!toc) {
        return;
    }

    const shortLabels = {
        "#samples-features-and-targets": "Samples, features, and targets",
        "#regression-or-classification": "Regression vs. classification",
        "#start-with-the-complete-prediction-flow": "Complete prediction flow",
        "#read-the-architecture-from-left-to-right": "Read the architecture",
        "#understand-the-responsibility-of-each-layer": "Layer responsibilities",
        "#compare-two-complete-network-designs": "Compare network designs",
        "#zoom-in-what-does-one-neuron-do": "Inside one neuron",
        "#activation-functions-transform-neuron-output": "Activation functions",
        "#training-configures-the-internal-parameters": "How training works",
        "#architecture-is-a-model-design-decision": "Architecture decisions",
        "#from-concepts-to-java-objects": "Concepts to Java objects",
        "#matching-the-output-to-the-problem": "Match output to problem",
        "#saving-preprocessing-with-the-model": "Save preprocessing",
        "#the-complete-api-flow": "Complete API flow",
        "#explore-the-complete-api-flows": "Explore runnable APIs",
        "#1-define-the-prediction-problem": "1. Define the problem",
        "#2-configure-the-runtime": "2. Configure runtime",
        "#3-load-the-data": "3. Load data",
        "#4-inspect-and-understand-the-data": "4. Inspect data",
        "#5-shuffle-the-samples": "5. Shuffle samples",
        "#6-create-training-and-test-sets": "6. Create train/test sets",
        "#7-fit-preprocessing-on-training-data": "7. Fit preprocessing",
        "#8-choose-the-smallest-suitable-model": "8. Choose the model",
        "#9-match-activation-and-loss-to-the-task": "9. Match activation and loss",
        "#10-configure-training": "10. Configure training",
        "#11-train-the-model": "11. Train the model",
        "#12-evaluate-on-unseen-data": "12. Evaluate the model",
        "#13-save-the-complete-prediction-pipeline": "13. Save the pipeline",
        "#14-predict-new-samples": "14. Predict new samples",
        "#keep-experiments-reproducible": "Reproducible experiments",
        "#separate-learning-building-and-running": "Learn, build, and run",
        "#run-the-complete-workflows": "Run complete workflows"
    };

    toc.querySelectorAll("a").forEach(function (link) {
        const label = shortLabels[link.getAttribute("href")];

        if (label) {
            link.textContent = label;
        }
    });

    const originalHeading = toc.previousElementSibling;
    const pageToc = document.createElement("aside");
    const heading = document.createElement("h2");

    pageToc.className = "page-toc";
    pageToc.setAttribute("aria-label", "On this page");
    heading.textContent = "On this page";

    pageToc.appendChild(heading);
    pageToc.appendChild(toc);
    document.body.appendChild(pageToc);

    if (originalHeading && originalHeading.tagName === "H2") {
        originalHeading.remove();
    }
});
