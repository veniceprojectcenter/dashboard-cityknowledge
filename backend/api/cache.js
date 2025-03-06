// services/Cache.js
const redisClient = require('./redis');

class Cache {
    constructor() {
        if (!Cache.instance) {
            Cache.instance = this;
        }
        return Cache.instance;
    }

    /**
     * Calcola il TTL dinamico fino all'orario target specificato.
     * Se l'orario target è già passato, viene impostato per il giorno successivo.
     * @param {number} hour - Ora target (formato 24h)
     * @param {number} minute - Minuti target (default: 0)
     * @param {number} second - Secondi target (default: 0)
     * @returns {number} TTL in secondi
     */
    computeDynamicTTL(hour, minute = 0, second = 0) {
        const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Rome" }));
        let expiration = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, second);
        if (expiration <= now) {
            expiration.setDate(expiration.getDate() + 1);
        }
        return Math.floor((expiration - now) / 1000);
    }

    /**
     * Middleware per la gestione della cache.
     * @param {string} key - Chiave della cache
     * @param {Function} fetchFunction - Funzione per ottenere i dati in caso di cache miss
     * @param {Object|number} expiration - Se è un oggetto `{ hour, minute, second }`, usa TTL dinamico. Se è un numero, usa TTL fisso.
     * @returns {Promise<any>} Dati ottenuti, dalla cache o freschi
     */
    async getOrSetCache(key, fetchFunction, expiration) {
        const cachedData = await redisClient.getData(key);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const freshData = await fetchFunction();
        let ttl;

        if (typeof expiration === "object") {
            ttl = this.computeDynamicTTL(expiration.hour, expiration.minute, expiration.second);
        } else {
            ttl = expiration; // TTL fisso in secondi
        }

        await redisClient.setData(key, JSON.stringify(freshData), ttl);
        return freshData;
    }
}

const cacheInstance = new Cache();
module.exports = cacheInstance;
