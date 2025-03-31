module.exports = async (client, guild) => {
    // Ajoutez une nouvelle ligne dans la base de données pour cette guilde
    try {
        await client.db.query("INSERT IGNORE INTO guilds (guildId, lang, prefix, embedColor, ownerBot, whitelist, blChannel) VALUES (?, ?, ?, ?, ?, ?, ?)", [guild.id, 'fr', client.config.prefix, "#2e2e34", "0", "0", "0"]);
        console.log(`Guilde ${guild.name} ajoutée à la base de données.`);
    } catch (error) {
        console.error(`Erreur lors de l'ajout de la guilde ${guild.id} dans la base de données : ${error.message}`);
    }
};
