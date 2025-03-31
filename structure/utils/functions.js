const { time } = require("discord.js");

let actualModelLoad = 0;

module.exports = {
    sleep: ms => new Promise(resolve => setTimeout(resolve, ms)),
    isLink(string) {
        const discordInvite = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;
        const reg = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
        return reg.test(string) || discordInvite.test(string)
    },
    tempMessage(message, reply) {
        return message.reply({ embeds: [{ color: 10181046, description: reply }] })
            .then(mp => setTimeout(() => mp.delete(), 4000));
    },
    timeFromMs(ms, units = ["days", "hours", "minutes", "seconds"]) {
        const time = {
            days: Math.floor(ms / (1000 * 60 * 60 * 24)),
            hours: Math.floor((ms / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((ms / (1000 * 60)) % 60),
            seconds: Math.floor((ms / 1000) % 60),
        };

        const formattedTime = [];

        for (const unit of units) {
            if (time[unit] > 0 || formattedTime.length > 0) {
                formattedTime.push(`${time[unit]}${unit.charAt(0)}`);
            }
        }

        return formattedTime.length > 0 ? formattedTime.join(' ') : '0s';
    },
    getFormattedTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0'); 
        const minutes = now.getMinutes().toString().padStart(2, '0'); 
        const seconds = now.getSeconds().toString().padStart(2, '0'); 
        return `[${hours}:${minutes}:${seconds}]`;
    },
    formatRemainingTime(seconds) {
        const hours = Math.floor(seconds / 3600); 
        const minutes = Math.floor((seconds % 3600) / 60); 
        const remainingSeconds = Math.floor(seconds % 60); 
    
        let formattedTime = '';
    
        if (hours > 0) {
            formattedTime += `${hours}h `;
        }
    
        if (minutes > 0) {
            formattedTime += `${minutes}m `;
        }
    
        if (remainingSeconds > 0 || (hours === 0 && minutes === 0)) {
            formattedTime += `${remainingSeconds}s`;
        }
    
        return formattedTime.trim(); 
    }
}
