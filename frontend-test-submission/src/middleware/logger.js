import axios from 'axios';

const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

/**
 * Sends a log to the evaluation test server.
 * @param {string} level The severity level ('info', 'error', 'warn', etc.).
 * @param {string} pkg The part of the app ('component', 'api', 'page', etc.).
 * @param {string} message The descriptive log message.
 */
const Log = async (level, pkg, message) => {
  // Retrieve the auth token you saved after authentication.
  // We'll use localStorage in this example.
  const authToken = localStorage.getItem('authToken');

  if (!authToken) {
    console.error("Auth token not found. Cannot send log.");
    return;
  }

  const requestBody = {
    stack: "frontend",
    level: level,
    package: pkg,
    message: message,
  };

  try {
    await axios.post(LOG_API_URL, requestBody, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  } catch (error) {
    // Use console.error for debugging the logger itself, but not for app logging.
    console.error("Failed to send log:", error.response ? error.response.data : error.message);
  }
};

export default Log; 