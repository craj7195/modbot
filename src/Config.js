const Discord = require('discord.js');

/**
 * Database
 * @type {Database}
 */
let database;

/**
 * Config cache time (ms)
 * @type {Number}
 */
const cacheDuration = 10*60*1000;

class Config {

    /**
     * Cache for all configs by tableName
     * @type {{}}
     */
    static cache = {}

    /**
     * table name
     * @type {String}
     */
    static tableName;

    /**
     * @param {module:"discord.js".Snowflake} id ID in the database
     */
    constructor(id) {
        this.id = id;
    }

    /**
     * save database
     * @param {Database} db
     */
    static init(db) {
        database = db;
    }

    static getCache() {
        let cache = this.cache[this.tableName];
        if (!cache) {
            /**
             * config cache
             * @type {module:"discord.js".Collection}
             */
            cache = new Discord.Collection();

            this.cache[this.tableName] = cache;
        }
        return cache;
    }

    /**
     * Save to db and cache
     * @async
     * @return {Promise<>}
     */
    async save() {
        if(Object.keys(this).length <= 1) {
            await database.query("DELETE FROM guilds WHERE id = ?",this.id);
            this.constructor.getCache().delete(this.id);
            return;
        }
        let result = await database.query(`SELECT * FROM ${database.escapeId(this.constructor.tableName)} WHERE id = ?`,[this.id]);
        if(result){
            await database.query(`UPDATE ${database.escapeId(this.constructor.tableName)} SET config = ? WHERE id = ?`,[JSON.stringify(this),this.id]);
        }
        else {
            await database.query(`INSERT INTO ${database.escapeId(this.constructor.tableName)} (config,id) VALUES (?,?)`,[JSON.stringify(this),this.id]);
            this.constructor.getCache().set(this.id, this);
        }
    }

    /**
     * Get items for a channel
     * @async
     * @param {module:"discord.js".Snowflake} id
     * @return {module:"discord.js".Collection<Number,Config>}
     */
    static async get(id) {

        if (!this.getCache().has(id)) {
            let result = await database.query(`SELECT * FROM ${database.escapeId(this.tableName)} WHERE id = ?`, id);
            if(!result) return new this(id);
            this.getCache().set(result.id, new this(result.id, JSON.parse(result.config)));
            setTimeout(() => {
                this.getCache().delete(result.id);
            },cacheDuration);
        }

        return this.getCache().get(id);
    }
}

module.exports = Config;
