document.addEventListener("DOMContentLoaded", function () {
    const toc = document.getElementById("toc");
    const sideNavigation = document.getElementById("side");

    if (sideNavigation) {
        const syncNavigationState = function () {
            document.body.classList.toggle(
                "navigation-collapsed",
                sideNavigation.classList.contains("chess")
            );
        };
        const navigationObserver = new MutationObserver(syncNavigationState);

        navigationObserver.observe(sideNavigation, {
            attributes: true,
            attributeFilter: ["class"]
        });
        syncNavigationState();
    }

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
        "#at-a-glance": "At a glance",
        "#what-you-built": "What you built",
        "#run-the-complete-project": "Run the project",
        "#continue": "Continue",
        "#before-continuing": "Before continuing",
        "#choose-the-compatible-distribution": "Choose a distribution",
        "#required-software": "Required software",
        "#what-this-verifies": "What this verifies",
        "#1-get-the-project": "1. Get the project",
        "#2-confirm-the-active-jdk": "2. Confirm the JDK",
        "#expected-result": "Expected result",
        "#if-it-fails": "If it fails",
        "#1-extract-the-deep-netts-distribution": "1. Extract Deep Netts",
        "#2-install-the-libraries-in-your-local-maven-repository": "2. Install Maven artifacts",
        "#3-add-the-maven-dependencies": "3. Add dependencies",
        "#4-target-java-22": "4. Target Java 22",
        "#5-enable-the-vector-api-at-runtime": "5. Enable Vector API",
        "#maven-cannot-resolve-a-deep-netts-artifact": "Maven artifact errors",
        "#the-vector-api-module-is-missing": "Vector API errors",
        "#get-the-example-projects": "Get the projects",
        "#generated-model-files": "Generated models",
        "#troubleshooting-checklist": "Troubleshooting",
        "#samples-features-and-targets": "Samples, features, and targets",
        "#regression-or-classification": "Regression vs. classification",
        "#from-concepts-to-java-objects": "Concepts to Java objects",
        "#matching-the-output-to-the-problem": "Match output to problem",
        "#saving-preprocessing-with-the-model": "Save preprocessing",
        "#the-complete-api-flow": "Complete API flow",
        "#see-the-api-in-practice": "See the API in practice",
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
        "#12-predict-execution-time": "12. Predict execution time",
        "#1-define-the-program-configuration": "1. Define configuration",
        "#3-load-the-csv-dataset": "3. Load the dataset",
        "#4-inspect-what-was-loaded": "4. Inspect the data",
        "#5-shuffle-and-create-a-traintest-split": "5. Shuffle and split",
        "#6-standardize-the-numerical-features": "6. Standardize features",
        "#7-build-the-linear-model": "7. Build the model",
        "#8-configure-and-run-training": "8. Configure training",
        "#9-evaluate-unseen-data": "9. Evaluate the model",
        "#10-save-the-model-with-preprocessing": "10. Save model and preprocessing",
        "#11-predict-computer-performance": "11. Predict performance",
        "#3-load-the-labeled-emails": "3. Load the emails",
        "#5-shuffle-and-split-the-samples": "5. Shuffle and split",
        "#7-build-the-classification-network": "7. Build the network",
        "#8-configure-mini-batch-training": "8. Configure training",
        "#9-evaluate-the-classifier": "9. Evaluate the model",
        "#10-save-the-model-and-scaler": "10. Save model and scaler",
        "#11-describe-a-new-email": "11. Define an email",
        "#12-predict-probability-and-class": "12. Predict class",
        "#2-map-the-class-order": "2. Map class order",
        "#4-load-the-flowers": "4. Load the flowers",
        "#7-scale-the-measurements": "7. Scale measurements",
        "#8-build-a-softmax-network": "8. Build Softmax network",
        "#10-evaluate-the-model": "10. Evaluate the model",
        "#11-save-model-and-scaler": "11. Save model and scaler",
        "#12-predict-probabilities": "12. Predict probabilities",
        "#13-select-the-species": "13. Select the species"
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

    const tocLinks = Array.from(toc.querySelectorAll("a[href^='#']"));
    const trackedSections = tocLinks
        .map(function (link) {
            const section = document.getElementById(
                decodeURIComponent(link.getAttribute("href").slice(1))
            );

            return section ? { link: link, section: section } : null;
        })
        .filter(Boolean);
    let scrollUpdatePending = false;

    const setActiveTocLink = function (activeLink) {
        tocLinks.forEach(function (link) {
            const isActive = link === activeLink;

            link.classList.toggle("current", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    };

    const updateActiveTocLink = function () {
        const headerOffset = 96;
        const scrollPosition = window.scrollY + headerOffset;
        const pageBottom = window.scrollY + window.innerHeight;
        const documentBottom = document.documentElement.scrollHeight;
        let activeEntry = trackedSections[0];

        trackedSections.forEach(function (entry) {
            const sectionTop =
                entry.section.getBoundingClientRect().top + window.scrollY;

            if (sectionTop <= scrollPosition) {
                activeEntry = entry;
            }
        });

        if (pageBottom >= documentBottom - 2 && trackedSections.length) {
            activeEntry = trackedSections[trackedSections.length - 1];
        }

        if (activeEntry) {
            setActiveTocLink(activeEntry.link);
        }

        scrollUpdatePending = false;
    };

    tocLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            setActiveTocLink(link);

            window.requestAnimationFrame(function () {
                window.requestAnimationFrame(function () {
                    setActiveTocLink(link);
                });
            });
        });
    });

    window.onscroll = null;
    window.addEventListener("scroll", function () {
        if (!scrollUpdatePending) {
            scrollUpdatePending = true;
            window.requestAnimationFrame(updateActiveTocLink);
        }
    }, { passive: true });
    window.addEventListener("resize", updateActiveTocLink);
    updateActiveTocLink();

    if (originalHeading && originalHeading.tagName === "H2") {
        originalHeading.remove();
    }
});
