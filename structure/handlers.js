const path = require("path");
const fs = require("fs").promises;

class FileHandler {
    constructor(client, dir, collectionName) {
        this.client = client;
        this.collectionName = collectionName;

        // Créez une propriété pour la collection basée sur collectionName
        this.client[this.collectionName] = new client.Collection();

        this.loadFiles(path.resolve(__dirname, "..", dir))
            .then(() => console.log(`✅ Dossier : ${dir} chargée avec succès !`))
            .catch(err => console.error(`Error loading ${collectionName}:`, err));
    }

    get(name) {
        return this.client[this.collectionName].get(name) || null;
    }

    async loadFiles(dirPath) {
        try {
            const entries = await fs.readdir(dirPath, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);
                const stats = await fs.stat(fullPath);

                if (entry.name.endsWith(".disabled")) continue;

                if (stats.isDirectory()) {
                    await this.loadFiles(fullPath);
                } else if (entry.name.endsWith(".js")) {
                    this.registerFile(fullPath);
                }
            }
        } catch (err) {
            console.error(`Error reading directory ${dirPath}:`, err);
        }
    }

    registerFile(file) {
        try {
            const module = require(file);
            const name = path.basename(file, ".js");

            if (module.name && module.dictionnary) {
                this.client[this.collectionName].set(name.toLowerCase(), module.dictionnary);
            }
            if (module.data) {
                const commandName = module.data.name.toLowerCase();
                if (!this.client[this.collectionName].has(commandName)) {
                    this.client[this.collectionName].set(commandName, module);
                    /*console.log(this.client[this.collectionName].get(commandName), this.collectionName);*/
                }
            } else {
                this.client.on(name, (...args) => {
                    try {
                        module(this.client, ...args);
                    } catch (error) {
                        console.error(`Error in handler ${name}:`, error);
                    }
                });
            }
            delete require.cache[require.resolve(file)];
        } catch (err) {
            console.error(`Error registering file ${file}:`, err);
        }
    }
}

module.exports = class MyHandler {
    constructor(client) {
        this.client = client;
        this.EventHandler = new FileHandler(client, "events", "eventHandler");
        this.CommandHandler = new FileHandler(client, "commands", "commandHandler");
        this.LangHandler = new FileHandler(client, "locales", "LangHandler");
    }
}
