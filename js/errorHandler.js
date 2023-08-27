const errorContainer = document.getElementById('errorContainer');

// Get a reference to the consoleOutput div
const consoleOutput = document.getElementById('consoleOutput');

// Store the original console.log function
const originalConsoleLog = console.log;

// Override the console.log function
console.log = function(message) {
    // Call the original console.log function
    originalConsoleLog.apply(console, arguments);
    
    // Append the log message to the consoleOutput div
    const logMessage = document.createElement('div');
    logMessage.textContent = message;
    consoleOutput.appendChild(logMessage);
};

// Test the overridden console.log
console.log('This message will appear in the consoleOutput div.');

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
