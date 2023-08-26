const errorContainer = document.getElementById('errorContainer');

// Function to handle errors and append them to the div
function handleError(message, source, lineno, colno, error) {
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('error-entry');
    errorDiv.innerHTML = `
        <p><strong>Error:</strong> ${message}</p>
        <p><strong>Source:</strong> ${source}</p>
        <p><strong>Line:</strong> ${lineno}</p>
        <p><strong>Column:</strong> ${colno}</p>
        <pre><code>${error.stack}</code></pre>
    `;
    errorContainer.appendChild(errorDiv);
}

// Set up the error handler
window.onerror = function (message, source, lineno, colno, error) {
    handleError(message, source, lineno, colno, error);
};
