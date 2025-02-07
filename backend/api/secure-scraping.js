const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

class SecureScraping {
  /**
   * List of proxy servers for secure requests.
   * @type {Array<string>}
   */
  listProxies = [];

  /**
   * List of user agents to rotate for requests.
   * @type {Array<string>}
   */
  listUserAgents = [];

  /**
   * Constructor for SecureScraping class.
   * Initializes the list of user agents and fetches the list of proxies.
   * @throws {Error} If no proxy servers are found.
   */
  async constructor() {
    // Initialize the list of user agents
    this.listUserAgents = [
      'Mozilla/5.0 (Linux; Android 13; Pixel 6 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
      'Mozilla/5.0 (Linux; Android 11; TC57 Build/11-35-05.00-RG-U00-C120-HEL-04; wv) AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Version/4.0 Chrome/129.0.6668.102 Mobile Safari/537.36 (AirWatch Browser v24.08.1.437)',
      'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.2pre) Gecko/20070213 BonEcho/2.0.0.2pre',
      'Callpod Keeper for Android 1.0 (app 16.10.0.132801/13280101) Dalvik/2.1.0 (Linux; U; Android 14; Pixel 7a Build/AP2A.240905.003)'
    ];

    // Fetch and initialize the list of proxies
    let listProxies = [];
    try {
      listProxies = await this.getUpdatedListProxies();
    } catch (error) {
      console.error('Error initializing SecureScraping:', error.message);
      throw error; // Rethrow to prevent object creation
    }

    if (listProxies.length === 0) {
      throw new Error('No proxy servers found.');
    }

    // Assign the fetched proxies to the class attribute
    this.listProxies = listProxies;
  }

  /**
   * Returns a random element from the provided array.
   * @param {Array} arr - The array to pick a random element from.
   * @returns {*} A random element from the array.
   * @throws {Error} If the array is empty or not an array.
   */
  getRandomElement(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error('Array must be non-empty.');
    }
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
  }

  /**
   * Performs a secure GET request using random proxies and user agents.
   *
   * @param {string} url - The URL for the GET request.
   * @param {Object} [headers={}] - Optional headers for the request.
   * @returns {Promise<Object>} The axios response.
   * @throws {Error} If the request fails.
   */
  async secureGet(url, headers = {}) {
    if (!url) {
      throw new Error('No URL provided for the GET request.');
    }

    try {
      // Select a random proxy and user agent
      const proxyUrl = this.getRandomElement(this.listProxies);
      const userAgent = this.getRandomElement(this.listUserAgents);

      // Create a proxy agent
      const agent = new HttpsProxyAgent(new URL(proxyUrl));

      // Set the User-Agent header
      headers['User-Agent'] = userAgent;

      return await axios.get(url, {
        headers,
        httpAgent: agent,
      });
    } catch (error) {
      console.error('Error during secure GET request:', error.message);
      throw error;
    }
  }

  /**
   * Fetches an updated list of proxies with retries.
   *
   * @param {number} maxRetries - Maximum number of retries.
   * @param {number} retryInterval - Interval between retries in milliseconds.
   * @returns {Promise<Array<string>>} A list of proxies.
   * @throws {Error} If no proxies are found after max retries.
   */
  async getUpdatedListProxies(maxRetries = 20, retryInterval = 20000) {
    let attempts = 0;
    let proxies;

    while (attempts < maxRetries) {
      try {
        proxies = await this.getListProxies();
        if (proxies && proxies.length > 0) {
          console.log(`Proxy list obtained after ${attempts + 1} attempt(s).`);
          return proxies;
        }
      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed:`, error.message);
      }

      console.warn(`Attempt ${attempts + 1} failed: empty list. Retrying in ${retryInterval / 1000} seconds...`);
      await this.delay(retryInterval);
      attempts++;
    }

    throw new Error(`Failed to obtain an updated proxy list after ${maxRetries} attempts.`);
  }

  /**
   * Delays execution for a specified time.
   *
   * @param {Function} func - Optional function to execute after the delay.
   * @param {number} ms - Delay duration in milliseconds.
   * @returns {Promise<void>}
   */
  async delay(func = () => {}, ms) {
    return new Promise((resolve) =>
        setTimeout(async () => {
          await func();
          resolve();
        }, ms)
    );
  }

  /**
   * Fetches a list of proxies from a remote source.
   *
   * @returns {Promise<Array<string>>} A list of proxies.
   * @throws {Error} If the request fails.
   */
  private async getListProxies() {
    const url = 'https://cdn.jsdelivr.net/gh/proxifly/free-proxy-list@main/proxies/protocols/https/data.json';
    let listProxies = [];

    try {
      const response = await axios.get(url, { responseType: 'json' });
      const data = Object.values(response.data);
      data.forEach((element) => {
        listProxies.push(element.proxy);
      });
      return listProxies;
    } catch (error) {
      console.error('Error fetching proxy list:', error.message);
      throw error;
    }
  }
}

module.exports = SecureScraping;