const { ActivityType } = require("discord.js");
module.exports = async (client) => {
    client.user.setPresence({
        activities: [{ name: `Base Bot | v1`, type: ActivityType.Streaming, url: "https://www.twitch.tv/bysaita" }],
        status: 'dnd',
    }); 
    console.log(`✅ ${client.user.username} est désormais connecté !`)
}
