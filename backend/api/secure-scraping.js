const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
/**
 * Create an Instance with create()
 */
class SecureScraping {
  /**
   * Private constructor.
   */
  constructor() {
  }

  /**
   * Returns a random element from the provided array.
   * Requires  an instance of the class.
   * @param {Array} arr - The array to pick a random element from.
   * @returns {*} A random element from the array.
   * @throws {Error} If the array is empty or not an array.
   */
  getRandomElement(arr) {
    if ( arr.length === 0) {
      throw new Error('Array must be non-empty.');
    }
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
  }

  /**
   * Performs a secure GET request using random proxies and user agents.
   * Requires  an instance of the class.
   * @param {string} url - The URL for the GET request.
   * @returns {Promise<Object>} The axios response.
   * @throws {Error} If the request fails.
   */
  async secureGet(url) {
    if (!url) {
      throw new Error('No URL provided for the GET request.');
    }

    try {
      return axios.get(url, {
        method: 'GET',
        proxy: {
          host: 'proxy-server.scraperapi.com',
          port: 8001,
          auth: {
            username: 'scraperapi',
            password: `${ process.env.SCRAPEAPY_KEY }`
          },
          protocol: 'http'
        }
      }).catch( (error) => {
        console.log(error);
      });

    } catch (error) {
      console.error('Error during secure GET request:', error.message);
      throw error;
    }
  }


  /**
   * Delays execution for a specified time.
   *
   * @param {Function} func - Optional function to execute after the delay.
   * @param {number} ms - Delay duration in milliseconds.
   * @returns {Promise<void>}
   */
  static async delay(func = () => {}, ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
    return await func();
  }




}

module.exports = SecureScraping;