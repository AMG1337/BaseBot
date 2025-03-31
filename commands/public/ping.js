const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        name: 'ws',
        description: 'Show the ping of the bot',
        aliases: ["ping"],
        usage: "",
        userPermissions: [""],
        clientPermissions: ["SendMessages", "EmbedLinks", "AttachFiles"],
        cooldown: 2000,
    },
    run: async (client, message, args) => {

        const [guildRows] = await client.db.query("SELECT * FROM guilds WHERE guildId = ?", [message.guild.id]);
        guildData = guildRows

        const msg = await message.reply({ content: client.LangHandler.get(guildData.lang).pingCommand.wait, fetchReply: true, ephemeral: true });
        const ms = msg.createdTimestamp - message.createdTimestamp

        const embed = new EmbedBuilder()
        .setColor(guildData.embedColor)
        .setTitle(`${client.LangHandler.get(guildData.lang).pingCommand.title} ${client.user.username}`)
        .setDescription(`${client.LangHandler.get(guildData.lang).pingCommand.ping(ms, client.ws.ping)}`)
        .setFooter({
            text: `${client.config.name}・${client.LangHandler.get(guildData.lang).autres.demandepar} ${message.author.globalName }・${client.functions.getFormattedTime()}`,
            iconURL: client.user.displayAvatarURL({ dynamic: true })
        })

        return msg.edit({ content: "", embeds: [embed] });
    }
}
