/*
    Name: Jonathan Graydon
    Date Created: April 1, 2026
    File Description: Validates the assignment-specific email format on the Whiplash sign-in page before the form is submitted.
*/

window.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const emailFeedback = document.getElementById("emailFeedback");

    if (!loginForm || !emailInput || !emailFeedback) {
        return;
    }

    /**
     * Checks whether an email matches the assignment's stricter format rule.
     *
     * @param {string} emailValue The email address entered by the user.
     * @returns {boolean} True when the email contains valid text with a dot after the @ symbol.
     */
    function isValidEmailFormat(emailValue) {
        return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(emailValue.trim());
    }

    /**
     * Updates the visible feedback message under the email field.
     *
     * @param {string} feedbackText The message that should be displayed.
     * @returns {void} No value is returned.
     */
    function showEmailFeedback(feedbackText) {
        emailFeedback.textContent = feedbackText;
        emailFeedback.classList.toggle("has-error", feedbackText !== "");
    }

    /**
     * Validates the email field and applies a custom browser validity message when needed.
     *
     * @returns {boolean} True when the email field passes validation, otherwise false.
     */
    function validateEmailField() {
        const trimmedEmail = emailInput.value.trim();

        if (trimmedEmail === "") {
            emailInput.setCustomValidity("Please enter an email address.");
            showEmailFeedback("Please enter an email address.");
            return false;
        }

        if (!isValidEmailFormat(trimmedEmail)) {
            emailInput.setCustomValidity("Use an email with a dot after the @ symbol, like a@b.c.");
            showEmailFeedback("Use an email with a dot after the @ symbol, like a@b.c.");
            return false;
        }

        emailInput.setCustomValidity("");
        showEmailFeedback("");
        return true;
    }

    /**
     * Prevents form submission when the assignment-specific email check fails.
     *
     * @param {SubmitEvent} eventObject The submit event raised by the browser.
     * @returns {void} No value is returned.
     */
    function handleFormSubmit(eventObject) {
        if (!validateEmailField()) {
            eventObject.preventDefault();
            emailInput.reportValidity();
        }
    }

    emailInput.addEventListener("input", validateEmailField);
    loginForm.addEventListener("submit", handleFormSubmit);
});
