const config = require('../config.json');
const Config = require('./Config');

/**
 * Class representing the config of a guild
 */
class GuildConfig extends Config {

    static tableName = 'guilds';

    /**
     * Constructor - create a guild config
     *
     * @param  {module:"discord.js".Snowflake}    id                  guild id
     * @param  {Object}                           [json]              options
     * @param  {module:"discord.js".Snowflake}    [json.logChannel]   id of the log channel
     * @param  {module:"discord.js".Snowflake}    [json.mutedRole]    id of the muted role
     * @param  {module:"discord.js".Snowflake[]}  [json.modRoles]     array with ids of the moderator roles
     * @param  {Object}                           [json.punishments]  automatic punishments for strikes
     * @param  {String}                           [json.playlist]     id of youtube playlist for tutorials
     * @param  {String}                           [json.helpcenter]   subdomain of the zendesk help center
     * @param  {Boolean}                          [json.invites]      allow invites (can be overwritten per channel)
     * @param  {Number}                           [json.linkCooldown] cooldown on links in s (user based)
     * @param  {String}                           [json.prefix]       alternative prefix for commands
     * @param  {Boolean}                          [json.capsMod]      should caps be automatically deleted
     * @return {GuildConfig}
     */
    constructor(id, json) {
        super(id);

        if (json) {
          this.logChannel = json.logChannel;
          this.mutedRole = json.mutedRole;
          this.modRoles = json.modRoles;
          this.punishments = json.punishments;
          this.playlist = json.playlist;
          this.helpcenter = json.helpcenter;
          this.invites = json.invites;
          this.linkCooldown = json.linkCooldown;
          this.prefix = json.prefix;
          this.capsMod = json.capsMod || false;
        }

        if (!this.punishments) {
          this.punishments = {};
        }

        if (!this.modRoles) {
          this.modRoles = [];
        }

        if (!this.prefix) {
          this.prefix = config.prefix;
        }
    }

    /**
     * Is this a moderator role?
     *
     * @param  {module:"discord.js".Snowflake} role role id
     * @return {Boolean}
     */
    isModRole(role) {
      return this.modRoles.includes(role);
    }

    /**
     * Add this role to the moderator roles
     *
     * @param  {module:"discord.js".Snowflake} role role id
     */
    addModRole(role) {
      this.modRoles.push(role);
    }

    /**
     * Remove this role from the moderator roles
     *
     * @param  {module:"discord.js".Snowflake} role role id
     */
    removeModRole(role) {
      let newRoles = [];
      for (let modRole of this.modRoles) {
        if (modRole !== role)
          newRoles.push(modRole);
      }
      this.modRoles = newRoles;
    }
}

module.exports = GuildConfig;
