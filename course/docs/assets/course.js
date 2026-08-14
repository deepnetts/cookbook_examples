document.addEventListener("DOMContentLoaded", function () {
    const toc = document.getElementById("toc");

    const pageBody = document.getElementById("body");
    const previousPage = document.querySelector(".markdown-body > .prev");
    const nextPage = document.querySelector(".markdown-body > .next");

    if (pageBody && (previousPage || nextPage)) {
        const pageNavigation = document.createElement("nav");

        pageNavigation.className = "page-navigation";
        pageNavigation.setAttribute("aria-label", "Page navigation");

        if (previousPage) {
            pageNavigation.appendChild(previousPage);
        }

        if (nextPage) {
            pageNavigation.appendChild(nextPage);
        }

        pageBody.insertAdjacentElement("afterend", pageNavigation);
    }

    if (pageBody) {
        pageBody.querySelectorAll("pre").forEach(function (codeBlock) {
            const copyableCode = codeBlock.querySelector(
                "code.language-java, " +
                "code.language-bash, " +
                "code.language-shell, " +
                "code.language-console, " +
                "code.language-xml"
            );

            if (!copyableCode) {
                return;
            }

            const wrapper = document.createElement("div");
            const copyButton = document.createElement("button");

            wrapper.className = "code-block";
            copyButton.className = "copy-code-button";
            copyButton.type = "button";
            copyButton.dataset.tooltip = "Copy code";
            copyButton.setAttribute("aria-label", "Copy code to clipboard");
            copyButton.innerHTML =
                '<svg viewBox="0 0 16 16" aria-hidden="true">' +
                '<path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>' +
                '<path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>' +
                "</svg>";

            codeBlock.parentNode.insertBefore(wrapper, codeBlock);
            wrapper.appendChild(codeBlock);
            wrapper.appendChild(copyButton);

            copyButton.addEventListener("click", async function () {
                const code = copyableCode.textContent;

                try {
                    await navigator.clipboard.writeText(code);
                } catch (error) {
                    const textArea = document.createElement("textarea");

                    textArea.value = code;
                    textArea.setAttribute("readonly", "");
                    textArea.style.position = "fixed";
                    textArea.style.opacity = "0";
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand("copy");
                    textArea.remove();
                }

                copyButton.dataset.tooltip = "Copied!";
                copyButton.setAttribute("aria-label", "Code copied");
                copyButton.classList.add("copied");

                window.setTimeout(function () {
                    copyButton.dataset.tooltip = "Copy code";
                    copyButton.setAttribute("aria-label", "Copy code to clipboard");
                    copyButton.classList.remove("copied");
                }, 1500);
            });
        });
    }

    if (!toc) {
        return;
    }

    const shortLabels = {
        "#samples-features-and-targets": "Samples, features, and targets",
        "#regression-or-classification": "Regression vs. classification",
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
        "#run-the-complete-workflows": "Run complete workflows",
        "#1-configure-the-program": "1. Configure the program",
        "#2-select-cpu-execution": "2. Select CPU execution",
        "#3-select-the-model-columns": "3. Select model columns",
        "#4-load-the-dataset": "4. Load the dataset",
        "#5-inspect-the-data": "5. Inspect the data",
        "#6-create-train-and-test-sets": "6. Create train/test sets",
        "#7-standardize-the-feature": "7. Standardize feature",
        "#8-build-a-1-to-1-model": "8. Build 1 to 1 model",
        "#9-train-the-model": "9. Train the model",
        "#10-evaluate-on-unseen-data": "10. Evaluate the model",
        "#11-save-the-complete-pipeline": "11. Save the pipeline",
        "#12-predict-execution-time": "12. Predict execution time"
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
