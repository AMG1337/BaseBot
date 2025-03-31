const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { Collection } = require("./utils/collection");
const MyHandlers = require("./handlers");
const MyData = require("./database.js");

module.exports = class extends Client {
    constructor(config) {
        super({
            intents: [
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.MessageContent
            ],
            partials: [
                Partials.Channel,
                Partials.User,
                Partials.Message,
                Partials.GuildMember,
            ],
        });

        this.Collection = Collection;
        this.functions = require("./utils/functions");
        this.config = config;
        this.login(config.token).catch(() => {
            throw new Error("invalid Token.")
        });

        this.db = new MyData(this);

        this._fs = require("fs");
        this._fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

    }
    startHandlers() {
        this.handlers = new MyHandlers(this);
        if (this.isReady()) {
            setTimeout(() => this.emit('ready'), 100);
        }
    }
    langManager() {
        return this.handlers.langManager;
    }
    isBotOwner(authorId) {
        return !!this.config.owners.includes(authorId);
    }
}
