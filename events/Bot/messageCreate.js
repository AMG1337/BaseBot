const { EmbedBuilder} = require("discord.js");

const cooldowns = new Map();

module.exports = async (client, message) => {
    if (!message.guild || message.author.bot || message.author.system) return;

    const botMember = message.guild.members.me;

    try {
        const [guildRows] = await client.db.query("SELECT * FROM guilds WHERE guildId = ?", [message.guild.id]);
        guildData = guildRows

        if (!guildData) {
            await client.db.query("INSERT IGNORE INTO guilds (guildId, lang, prefix, embedColor, ownerBot, whitelist, blChannel) VALUES (?, ?, ?, ?, ?, ?, ?)", 
                [message.guild.id, 'fr', client.config.prefix, "#2e2e34", "0", "0", "0"]);

            const [newGuildRows] = await client.db.query("SELECT * FROM guilds WHERE guildId = ?", [message.guild.id]);
            guildData = newGuildRows[0];
        }
    } catch (error) {
        console.error("Erreur lors de la récupération ou de la création de la guilde dans la DB:", error);
        return;
    }
    if (!guildData) {
        return;
    }

    const prefix = guildData.prefix || client.config.prefix;

    if (message.content.trim() === `<@${client.user.id}>` || message.content.trim() === `<@!${client.user.id}>`) {
        return message.reply({ content: client.LangHandler.get(guildData.lang).mentionbot(message.author.globalName) });
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    if (!commandName) return;

    const command = client.commandHandler.get(commandName) || Array.from(client.commandHandler.values()).find(c =>
        c.data?.aliases?.includes(commandName)
    );

    if (!command) return;

    if (command.data.clientPermissions) {
        for (const perm of command.data.clientPermissions) {
            if (!botMember || !message.channel.permissionsFor(botMember)?.has(perm)) {
                return message.reply({
                    content: `❌ Je n'ai pas la permission \`${perm}\` pour exécuter cette commande.`,
                }).catch(() => {}); 
            }
        }
    }

    guildData.langManager = client.LangHandler.get(guildData.lang);

    const cooldownTime = command.data.cooldown || 0; 
    const cooldownKey = `${message.guild.id}-${message.author.id}-${command.data.name}`;

    if (cooldownTime > 0) {
        if (cooldowns.has(cooldownKey)) {
            const remainingTime = (cooldowns.get(cooldownKey) - Date.now()) / 1000;
            const formattedTime = client.functions.formatRemainingTime(remainingTime); 

            const embed = new EmbedBuilder()
                .setTitle(`❌・Cooldown`)
                .setColor("#ff0000")
                .setDescription(client.LangHandler.get(guildData.lang).cooldown(formattedTime))
                .setFooter({
                    text: `${client.config.name}`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true })
                });

            if (remainingTime > 0) {
                return message.reply({ embeds: [embed] });
            }
        }

        cooldowns.set(cooldownKey, Date.now() + cooldownTime);
        setTimeout(() => cooldowns.delete(cooldownKey), cooldownTime);
    }

    command.run(client, message, args);
};
