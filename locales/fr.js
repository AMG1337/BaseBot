module.exports = {
    name: "Français",
    dictionnary: {
      mentionbot: (name) => {
        return `Salut **${name}** utilise la commande \`/help\` pour découvrir mes commandes !`
      },
      cooldown: (time) => {
        return `**Veuillez attendre** \`${time}\` **avant de réutiliser cette commande !**`;
      },
      pingCommand : {
        title: "Latence de",
        ping: (client, api) => {
          return `**🚀・Client:** \`${client} ms\`\n\n**💻・API:** \`${api} ms\``
        },
        wait: "**Calcul en cours...**"
      },
      AddBot : {
        title: (name) => {
          return `Ajoute ${name} sur ton serveur !`
        },
        description: "🔎・*Clique sur le bouton ci-dessous pour m'ajouter à un serveur*",
        bouton: "Clique ici !",
      },
  
      autres: {
        demandepar: "Demandé par:"
      },
    },
  };
  
