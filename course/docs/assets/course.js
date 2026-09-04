document.addEventListener("DOMContentLoaded", function () {
    const toc = document.getElementById("toc");
    const sideNavigation = document.getElementById("side");
    const navigationToggle = document.getElementById("nav-toggle");
    const navigationClose = document.querySelector(".mobile-navigation-close");
    const searchToggle = document.getElementById("nav-scrh");
    const headerSearch = document.querySelector(".header .search");

    const syncMobileNavigation = function () {
        const isOpen = Boolean(sideNavigation && sideNavigation.classList.contains("chess"));

        document.body.classList.toggle("mobile-navigation-open", isOpen);
        if (navigationToggle) {
            navigationToggle.setAttribute("aria-expanded", String(isOpen));
            navigationToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
        }
    };

    const closeMobileNavigation = function () {
        if (!sideNavigation) return;

        sideNavigation.classList.remove("chess");
        document.querySelector(".markdown-body.cake")?.classList.remove("cake");
        syncMobileNavigation();
        navigationToggle?.focus();
    };

    navigationToggle?.setAttribute("aria-controls", "side");
    navigationToggle?.setAttribute("aria-expanded", "false");
    navigationToggle?.setAttribute("tabindex", "0");
    navigationToggle?.addEventListener("click", function () {
        window.requestAnimationFrame(syncMobileNavigation);
    });
    navigationToggle?.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            navigationToggle.click();
        }
    });
    navigationClose?.addEventListener("click", closeMobileNavigation);

    searchToggle?.setAttribute("aria-controls", "mkdocs-search-query");
    searchToggle?.setAttribute("aria-expanded", "false");
    searchToggle?.addEventListener("click", function () {
        window.requestAnimationFrame(function () {
            const isOpen = Boolean(headerSearch && headerSearch.classList.contains("show"));
            searchToggle.setAttribute("aria-expanded", String(isOpen));
            if (isOpen) document.getElementById("mkdocs-search-query")?.focus();
        });
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && document.body.classList.contains("mobile-navigation-open")) {
            closeMobileNavigation();
        }
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 1100 && document.body.classList.contains("mobile-navigation-open")) {
            closeMobileNavigation();
        }
    });

    if (sideNavigation) {
        sideNavigation.querySelectorAll(".section-toggle").forEach(function (button) {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();

                const section = button.closest("details");

                if (section) {
                    section.open = !section.open;
                    button.setAttribute("aria-expanded", String(section.open));
                }
            });
        });

        sideNavigation.querySelectorAll("summary > a").forEach(function (link) {
            link.addEventListener("click", function (event) {
                event.stopPropagation();
            });
        });

    }

    const pageBody = document.getElementById("body");
    const previousPage = document.querySelector(".markdown-body > .prev");
    const nextPage = document.querySelector(".markdown-body > .next");
    const pageFeedback = document.querySelector("[data-page-feedback]");
    const pageFeedbackAnchor = document.querySelector("[data-page-feedback-anchor]");
    const pageFaq = document.querySelector("[data-page-faq]");

    if (pageFaq) {
        const faqDetails = Array.from(pageFaq.querySelectorAll("details"));
        const allFaqDetails = [pageFaq].concat(faqDetails);

        allFaqDetails.forEach(function (details) {
            const summary = details.querySelector(":scope > summary");

            details.addEventListener("toggle", function () {
                summary.setAttribute("aria-expanded", String(details.open));

                if (details.open && details !== pageFaq) {
                    faqDetails.forEach(function (otherDetails) {
                        if (otherDetails !== details) {
                            otherDetails.open = false;
                        }
                    });
                }
            });
        });
    }

    if (pageFeedback) {
        const feedbackButtons = Array.from(
            pageFeedback.querySelectorAll("[data-feedback-value]")
        );
        const feedbackForm = pageFeedback.querySelector("[data-feedback-form]");
        const feedbackComment = feedbackForm.querySelector("textarea");
        const feedbackHoneypot = feedbackForm.querySelector("input[name='website']");
        const feedbackSubmit = feedbackForm.querySelector("[data-feedback-submit]");
        const feedbackProgress = pageFeedback.querySelector("[data-feedback-progress]");
        const feedbackThanks = pageFeedback.querySelector("[data-feedback-thanks]");
        const feedbackError = pageFeedback.querySelector("[data-feedback-error]");
        const feedbackErrorMessage = pageFeedback.querySelector(
            "[data-feedback-error-message]"
        );
        const feedbackRetry = pageFeedback.querySelector("[data-feedback-retry]");
        const feedbackEndpoint = (pageFeedback.dataset.feedbackEndpoint || "").trim();
        const rawPagePath = pageFeedback.dataset.pagePath || window.location.pathname;
        const pagePath = ("/" + rawPagePath)
            .replace(/\/{2,}/g, "/")
            .replace(/\/?$/, "/");
        const pageTitle = pageFeedback.dataset.pageTitle || document.title;
        const feedbackIdStorageKey = "deepnetts-page-feedback-id:" + pagePath;
        const feedbackStateStorageKey = "deepnetts-page-feedback:" + pagePath;
        const uuidPattern =
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        let confirmedFeedback = { rating: "", comment: "" };
        let lastAttempt = null;
        let isSubmitting = false;

        const createResponseId = function () {
            if (window.crypto && typeof window.crypto.randomUUID === "function") {
                return window.crypto.randomUUID();
            }

            const randomValues = new Uint8Array(16);

            if (window.crypto && typeof window.crypto.getRandomValues === "function") {
                window.crypto.getRandomValues(randomValues);
            } else {
                for (let index = 0; index < randomValues.length; index += 1) {
                    randomValues[index] = Math.floor(Math.random() * 256);
                }
            }

            randomValues[6] = (randomValues[6] & 0x0f) | 0x40;
            randomValues[8] = (randomValues[8] & 0x3f) | 0x80;

            return Array.from(randomValues, function (value) {
                return value.toString(16).padStart(2, "0");
            }).map(function (value, index) {
                return [4, 6, 8, 10].includes(index) ? "-" + value : value;
            }).join("");
        };

        const getResponseId = function () {
            let responseId = "";

            try {
                responseId = window.localStorage.getItem(feedbackIdStorageKey) || "";
            } catch (error) {
                // A page-scoped ID is still available for the current page load.
            }

            if (!uuidPattern.test(responseId)) {
                responseId = createResponseId();

                try {
                    window.localStorage.setItem(feedbackIdStorageKey, responseId);
                } catch (error) {
                    // Submitting feedback does not depend on local storage access.
                }
            }

            return responseId;
        };

        const responseId = getResponseId();

        const needsCommentForm = function (rating) {
            return rating === "neutral" || rating === "not_helpful";
        };

        const setSelectedFeedback = function (rating) {
            feedbackButtons.forEach(function (button) {
                const isSelected = button.dataset.feedbackValue === rating;

                button.classList.toggle("selected", isSelected);
                button.setAttribute("aria-pressed", String(isSelected));
            });
        };

        const clearMessages = function () {
            feedbackProgress.hidden = true;
            feedbackThanks.hidden = true;
            feedbackError.hidden = true;
        };

        const setSubmitting = function (submitting) {
            isSubmitting = submitting;
            pageFeedback.setAttribute("aria-busy", String(submitting));
            feedbackButtons.forEach(function (button) {
                button.disabled = submitting;
            });
            feedbackComment.disabled = submitting;
            feedbackSubmit.disabled = submitting;
            feedbackRetry.disabled = submitting;
            feedbackProgress.hidden = !submitting;
            feedbackSubmit.textContent = submitting
                ? "Saving…"
                : (needsCommentForm(confirmedFeedback.rating)
                    ? "Update feedback"
                    : "Send feedback");
        };

        const storeConfirmedFeedback = function () {
            try {
                window.localStorage.setItem(feedbackStateStorageKey, JSON.stringify({
                    version: 2,
                    responseId: responseId,
                    rating: confirmedFeedback.rating,
                    comment: confirmedFeedback.comment,
                    updatedAt: new Date().toISOString()
                }));
            } catch (error) {
                // The response is already centralized even when local storage fails.
            }
        };

        const showError = function (message, canRetry) {
            feedbackProgress.hidden = true;
            feedbackThanks.hidden = true;
            feedbackErrorMessage.textContent = message;
            feedbackRetry.hidden = !canRetry;
            feedbackError.hidden = false;
        };

        const submitFeedback = async function (rating, comment) {
            if (isSubmitting) {
                return false;
            }

            const payload = {
                responseId: responseId,
                pagePath: pagePath,
                pageTitle: pageTitle,
                rating: rating,
                comment: rating === "helpful" ? null : comment,
                website: feedbackHoneypot.value
            };

            lastAttempt = payload;
            clearMessages();

            if (!feedbackEndpoint || feedbackEndpoint.includes("<project-ref>")) {
                showError("Feedback is not configured for this build.", false);
                return false;
            }

            setSubmitting(true);
            const requestController = typeof window.AbortController === "function"
                ? new window.AbortController()
                : null;
            const requestTimeout = requestController
                ? window.setTimeout(function () {
                    requestController.abort();
                }, 10000)
                : null;

            try {
                const requestOptions = {
                    method: "POST",
                    mode: "cors",
                    credentials: "omit",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                };

                if (requestController) {
                    requestOptions.signal = requestController.signal;
                }

                const response = await window.fetch(feedbackEndpoint, requestOptions);
                let result = null;

                try {
                    result = await response.json();
                } catch (error) {
                    // A malformed response is handled by the generic failure state.
                }

                if (!response.ok || !result || result.ok !== true) {
                    const requestError = new Error("Feedback request failed");

                    requestError.status = response.status;
                    requestError.publicMessage = result &&
                        typeof result.error === "string" &&
                        result.error.length <= 160
                        ? result.error
                        : "";
                    throw requestError;
                }

                confirmedFeedback = {
                    rating: rating,
                    comment: rating === "helpful" ? "" : comment
                };
                storeConfirmedFeedback();

                if (!needsCommentForm(rating)) {
                    feedbackComment.value = "";
                    feedbackForm.hidden = true;
                } else {
                    feedbackForm.hidden = true;
                    feedbackComment.blur();
                }

                feedbackThanks.hidden = false;
                return true;
            } catch (error) {
                let message = "We could not save your response. Check your connection and try again.";

                if (error.publicMessage) {
                    message = error.publicMessage;
                } else if (error.status === 429) {
                    message = "Please wait a moment, then try again.";
                } else if (error.name === "AbortError") {
                    message = "Saving took too long. Please try again.";
                }

                showError(message, true);
                return false;
            } finally {
                if (requestTimeout !== null) {
                    window.clearTimeout(requestTimeout);
                }
                setSubmitting(false);
            }
        };

        try {
            const storedFeedback = window.localStorage.getItem(feedbackStateStorageKey);

            if (storedFeedback) {
                const parsedFeedback = JSON.parse(storedFeedback);

                if (parsedFeedback.version === 2 &&
                    parsedFeedback.responseId === responseId &&
                    ["helpful", "neutral", "not_helpful"].includes(parsedFeedback.rating)) {
                    confirmedFeedback = {
                        rating: parsedFeedback.rating,
                        comment: parsedFeedback.comment || ""
                    };
                    setSelectedFeedback(confirmedFeedback.rating);
                    feedbackComment.value = confirmedFeedback.comment;
                    feedbackForm.hidden = !needsCommentForm(confirmedFeedback.rating);
                }
            }
        } catch (error) {
            // Ignore storage access errors and keep the component interactive.
        }

        feedbackButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                const rating = button.dataset.feedbackValue;

                setSelectedFeedback(rating);
                clearMessages();

                if (needsCommentForm(rating)) {
                    feedbackForm.hidden = false;
                } else {
                    feedbackForm.hidden = true;
                }

                if (confirmedFeedback.rating === rating) {
                    if (!needsCommentForm(rating) ||
                        confirmedFeedback.comment === feedbackComment.value.trim()) {
                        feedbackThanks.hidden = false;
                    }

                    if (needsCommentForm(rating)) {
                        feedbackComment.focus();
                    }
                    return;
                }

                // A positive response has no follow-up and is saved immediately.
                // Neutral and negative choices let the visitor add an optional note
                // before their selection is sent.
                if (rating === "helpful") {
                    submitFeedback(rating, null);
                }
            });
        });

        feedbackForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const comment = feedbackComment.value.trim();

            const selectedRating = feedbackButtons.find(function (button) {
                return button.getAttribute("aria-pressed") === "true";
            })?.dataset.feedbackValue;

            if (!needsCommentForm(selectedRating)) {
                return;
            }

            setSelectedFeedback(selectedRating);
            clearMessages();

            if (confirmedFeedback.rating === selectedRating &&
                confirmedFeedback.comment === comment) {
                feedbackThanks.hidden = false;
                return;
            }

            submitFeedback(selectedRating, comment);
        });

        feedbackComment.addEventListener("input", function () {
            feedbackThanks.hidden = true;
            feedbackError.hidden = true;
        });

        feedbackRetry.addEventListener("click", function () {
            if (!lastAttempt) {
                return;
            }

            submitFeedback(lastAttempt.rating, lastAttempt.comment || "");
        });
    }

    if (pageBody) {
        pageBody.querySelectorAll(":scope > .github-project-action")
            .forEach(function (githubAction) {
                const backContainer = githubAction.nextElementSibling;
                const backButton = backContainer &&
                    backContainer.querySelector(":scope > .back-button");

                if (!backButton) {
                    return;
                }

                const footerActions = document.createElement("div");

                footerActions.className = "example-footer-actions";
                githubAction.parentNode.insertBefore(footerActions, githubAction);
                footerActions.appendChild(backContainer);
                footerActions.appendChild(githubAction);
            });
    }

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
        if (pageFeedback) {
            pageFeedback.classList.remove("awaiting-placement");
        }
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
        "#4-target-java-25": "4. Target Java 25",
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
        "#2-choose-the-execution-environment": "2. Choose environment",
        "#3-load-and-inspect-the-data": "3. Understand data",
        "#4-separate-training-and-evaluation-data": "4. Separate datasets",
        "#5-fit-preprocessing-without-leakage": "5. Avoid leakage",
        "#6-choose-the-smallest-suitable-model": "6. Choose the model",
        "#7-match-output-activation-and-loss": "7. Match model output",
        "#8-configure-and-run-training": "8. Run training",
        "#9-evaluate-on-unseen-data": "9. Evaluate the model",
        "#10-save-the-complete-prediction-pipeline": "10. Save the pipeline",
        "#11-predict-new-samples-safely": "11. Predict safely",
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
    const isGlossaryPage = document.body.classList.contains("glossary-page");

    pageToc.className = "page-toc";
    pageToc.setAttribute(
        "aria-label",
        isGlossaryPage ? "Search glossary" : "On this page"
    );
    heading.textContent = isGlossaryPage ? "Search glossary" : "On this page";

    pageToc.appendChild(heading);

    if (isGlossaryPage) {
        const searchWrap = document.createElement("div");
        const searchLabel = document.createElement("label");
        const searchInput = document.createElement("input");
        const searchStatus = document.createElement("p");
        const searchHint = document.createElement("p");
        const glossaryLinks = Array.from(toc.querySelectorAll("a[href^='#']"));
        const utilityLinks = glossaryLinks.filter(function (link) {
            const target = link.getAttribute("href");
            return target === "#machine-learning-glossary" ||
                target === "#quick-navigation";
        });
        const termLinks = glossaryLinks.filter(function (link) {
            return !utilityLinks.includes(link);
        });

        searchWrap.className = "glossary-search";
        searchLabel.setAttribute("for", "glossary-search-input");
        searchLabel.textContent = "Find a term";
        searchInput.id = "glossary-search-input";
        searchInput.type = "search";
        searchInput.placeholder = "e.g. backpropagation";
        searchInput.maxLength = 30;
        searchInput.autocomplete = "off";
        searchInput.spellcheck = false;
        searchStatus.className = "glossary-search-status";
        searchStatus.setAttribute("aria-live", "polite");
        searchHint.className = "glossary-search-hint";
        searchHint.textContent = "Search term names, then select a result. Press Esc to clear.";
        let highlightedTerm = null;

        const clearGlossaryHighlight = function () {
            if (highlightedTerm) {
                highlightedTerm.classList.remove("glossary-term-highlight");
                highlightedTerm = null;
            }
        };

        termLinks.forEach(function (link) {
            link.addEventListener("click", function (event) {
                const targetId = decodeURIComponent(
                    link.getAttribute("href").slice(1)
                );
                const termHeading = document.getElementById(targetId);

                clearGlossaryHighlight();

                if (termHeading) {
                    termHeading.classList.add("glossary-term-highlight");
                    highlightedTerm = termHeading;
                }

                event.stopPropagation();
            });
        });

        document.addEventListener("click", clearGlossaryHighlight);

        const filterGlossary = function () {
            const query = searchInput.value.trim().toLocaleLowerCase();
            let matchCount = 0;

            termLinks.forEach(function (link) {
                const termName = link.textContent.trim().toLocaleLowerCase();
                const matches = !query || termName.includes(query);

                link.closest("li").hidden = !matches;
                if (matches) {
                    matchCount += 1;
                }
            });

            utilityLinks.forEach(function (link) {
                link.closest("li").hidden = Boolean(query);
            });
            searchStatus.textContent = query
                ? matchCount + (matchCount === 1 ? " result" : " results")
                : termLinks.length + " terms";
        };

        searchInput.addEventListener("input", filterGlossary);
        searchInput.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                if (searchInput.value) {
                    searchInput.value = "";
                    filterGlossary();
                }

                clearGlossaryHighlight();
            }
        });

        searchWrap.appendChild(searchLabel);
        searchWrap.appendChild(searchInput);
        searchWrap.appendChild(searchStatus);
        searchWrap.appendChild(searchHint);
        pageToc.appendChild(searchWrap);
        pageToc.appendChild(toc);
        filterGlossary();
    } else {
        pageToc.appendChild(toc);
    }
    const pageTocRail = document.createElement("div");
    pageTocRail.className = "page-toc-rail";
    pageTocRail.appendChild(pageToc);
    document.body.appendChild(pageTocRail);

    if (pageFeedback && pageFeedbackAnchor) {
        const desktopFeedbackLayout = window.matchMedia("(min-width: 1281px)");
        const placePageFeedback = function () {
            if (desktopFeedbackLayout.matches) {
                pageTocRail.appendChild(pageFeedback);
                pageFeedback.classList.add("in-page-toc-rail");
            } else {
                pageFeedbackAnchor.insertAdjacentElement("afterend", pageFeedback);
                pageFeedback.classList.remove("in-page-toc-rail");
            }
        };

        desktopFeedbackLayout.addEventListener("change", placePageFeedback);
        placePageFeedback();
        pageFeedback.classList.remove("awaiting-placement");
    }

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
