const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    data: {
        name: 'addbot',
        description: 'Get the bot invitation link',
        aliases: ["ADDBOT"],
        usage: "",
        userPermissions: [""],
        clientPermissions: ["SendMessages", "EmbedLinks", "AttachFiles"],
        cooldown: 2000,
    },
    run: async (client, message, guildData, memberData, args) => {

        const [guildRows] = await client.db.query("SELECT * FROM guilds WHERE guildId = ?", [message.guild.id]);
        guildData = guildRows
        
        const linkButton = new ButtonBuilder()
        .setLabel(`${client.LangHandler.get(guildData.lang).AddBot.bouton}`) 
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`); 

        const row = new ActionRowBuilder().addComponents(linkButton);

        const embed = new EmbedBuilder()
        .setColor(guildData.embedColor)
        .setTitle(`${client.LangHandler.get(guildData.lang).AddBot.title(client.user.username)}`)
        .setDescription(client.LangHandler.get(guildData.lang).AddBot.description)
        .setFooter({
            text: `${client.config.name}・${client.LangHandler.get(guildData.lang).autres.demandepar} ${message.author.globalName }・${client.functions.getFormattedTime()}`,
            iconURL: client.user.displayAvatarURL({ dynamic: true })
        })

        await message.reply({
            embeds: [embed],
            components: [row]
        })
    }
}
